const axios = require('axios'); 

async function testPush() {
  // 1. Target your local server
  const url = 'http://localhost:3000/api/stkpush'; 

  // 2. PUT YOUR REAL PHONE NUMBER HERE (Start with 254)
  const phone = "254769010009"; 
  const amount = 1;

  console.log(`🚀 Sending STK Push to ${phone}...`);

  try {
    const response = await axios.post(url, {
      phone: phone,
      amount: amount
    });
    console.log("✅ Response from Safaricom:", response.data);
  } catch (error) {
    console.error("❌ Error:", error.response ? error.response.data : error.message);
  }
}

testPush();