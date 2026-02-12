import axios from 'axios';

// 1. GENERATE TIMESTAMP, PASSWORD & RETURN SHORTCODE
const getMpesaPassword = () => {
  const shortCode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;

  // CHECK 1: Ensure env vars exist
  if (!shortCode || !passkey) {
    throw new Error("Missing MPESA_SHORTCODE or MPESA_PASSKEY in .env file");
  }
  
  const date = new Date();
  const timestamp = date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');
  
  // FIX: Return shortCode too so we don't have to re-check it later
  return { password, timestamp, shortCode };
};

// 2. GET ACCESS TOKEN
const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  // CHECK 2: Ensure keys exist to satisfy TypeScript
  if (!consumerKey || !consumerSecret) {
    throw new Error("Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET");
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("M-Pesa Token Error:", error);
    throw new Error("Failed to get M-Pesa Token");
  }
};

// 3. TRIGGER STK PUSH
export const triggerStkPush = async (phone: string, amount: number, accountRef: string) => {
  const token = await getAccessToken();
  
  // FIX: Destructure shortCode here to reuse the validated version
  const { password, timestamp, shortCode } = getMpesaPassword();
  
  // Format phone number (Must be 2547XXXXXXXX)
  const formattedPhone = phone.startsWith('0') ? '254' + phone.slice(1) : phone;

  const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  const callbackUrl = process.env.MPESA_CALLBACK_URL || process.env.APP_URL + '/api/mpesa/callback';

  if (!callbackUrl) throw new Error("Callback URL not defined");

  const data = {
    BusinessShortCode: shortCode, // Use the variable, NOT process.env
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline", 
    Amount: Math.ceil(amount), // Ensure no decimals
    PartyA: formattedPhone, 
    PartyB: shortCode, // Use the variable, NOT process.env
    PhoneNumber: formattedPhone,
    CallBackURL: callbackUrl, 
    AccountReference: accountRef, 
    TransactionDesc: "Payment for Medicine"
  };

  try {
    const response = await axios.post(url, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error("STK Push Failed:", error.response?.data || error.message);
    throw new Error("STK Push Failed");
  }
};