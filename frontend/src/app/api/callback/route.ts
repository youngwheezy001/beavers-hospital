import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("--------------------------------");
    console.log("💰 CALLBACK RECEIVED FROM SAFARICOM");
    
    const resultDesc = body.Body.stkCallback.ResultDesc;
    const resultCode = body.Body.stkCallback.ResultCode;

    if (resultCode === 0) {
      const metadata = body.Body.stkCallback.CallbackMetadata.Item;
      const amount = metadata.find((item: any) => item.Name === 'Amount').Value;
      const receipt = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber').Value;
      
      console.log(`✅ Success! Amount: ${amount}, Receipt: ${receipt}`);
    } else {
      console.log(`❌ Payment Failed: ${resultDesc}`);
    }
    console.log("--------------------------------");

    return NextResponse.json({ message: "Received" });
  } catch (error: any) {
    console.error("Callback Error:", error.message);
    return NextResponse.json({ error: "Failed to process callback" }, { status: 500 });
  }
}