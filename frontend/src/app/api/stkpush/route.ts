import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json();

    // 1. Force Phone Format (Remove 0, add 254)
    const formattedPhone = phone.startsWith("0") ? "254" + phone.slice(1) : phone;

    // 2. Generate Token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const tokenRes = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const accessToken = tokenRes.data.access_token;

    // 3. Generate Timestamp
    const date = new Date();
    const timestamp = date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    // 4. Send STK Push
    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      
      // ⚠️ THE FIX: We force this to google.com to guarantee the popup appears
      CallBackURL: process.env.MPESA_CALLBACK_URL!, 
      
      AccountReference: "Beavers",
      TransactionDesc: "Meds"
    };

    console.log("🚀 Sending Payload:", JSON.stringify(payload, null, 2));

    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(stkRes.data);

  } catch (error: any) {
    console.error("❌ ERROR:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}