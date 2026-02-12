const axios = require('axios');

// ---------------------------------------------------
// 👇 PASTE YOUR CREDENTIALS HERE FOR THIS TEST 👇
// ---------------------------------------------------
const CONSUMER_KEY = "GrvG9lZMat7ba3iLrISQ6JxAuYQsoVpZiUfsiUzn6rTxB74G";
const CONSUMER_SECRET = "MbG3kaM7CyTZSaay1HUccWstnX1tAqcFispCjKDrP8NgISiKxPKRbQyTEsd6rLI5";
const PHONE = "254769010009"; // Your Phone (Start with 254)

// (These are standard Sandbox values - DO NOT CHANGE)
const PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; 
const SHORTCODE = "174379"; 
// ---------------------------------------------------

async function runTest() {
    try {
        console.log("1. Generating Token...");
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
        const tokenRes = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            { headers: { Authorization: `Basic ${auth}` } }
        );
        const token = tokenRes.data.access_token;
        console.log("✅ Token Received!");

        console.log("2. Sending STK Push...");
        const date = new Date();
        const timestamp = date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2);
        
        const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

        const payload = {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: 1,
            PartyA: PHONE,
            PartyB: SHORTCODE,
            PhoneNumber: PHONE,
            CallBackURL: "https://example.com", // Dummy URL for testing
            AccountReference: "Test",
            TransactionDesc: "Test"
        };

        const stkRes = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("🎉 SUCCESS! Check your phone.");
        console.log(stkRes.data);

    } catch (err) {
        console.log("\n❌ HERE IS THE REAL ERROR:");
        if (err.response) {
            // This prints the EXACT reason Safaricom is rejecting you
            console.log(JSON.stringify(err.response.data, null, 2));
        } else {
            console.log(err.message);
        }
    }
}

runTest();