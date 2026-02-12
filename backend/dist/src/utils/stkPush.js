"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerStkPush = void 0;
const axios_1 = __importDefault(require("axios"));
const getMpesaPassword = () => {
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
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
    return { password, timestamp, shortCode };
};
const getAccessToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    if (!consumerKey || !consumerSecret) {
        throw new Error("Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET");
    }
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    try {
        const response = await axios_1.default.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', { headers: { Authorization: `Basic ${auth}` } });
        return response.data.access_token;
    }
    catch (error) {
        console.error("M-Pesa Token Error:", error);
        throw new Error("Failed to get M-Pesa Token");
    }
};
const triggerStkPush = async (phone, amount, accountRef) => {
    const token = await getAccessToken();
    const { password, timestamp, shortCode } = getMpesaPassword();
    const formattedPhone = phone.startsWith('0') ? '254' + phone.slice(1) : phone;
    const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const callbackUrl = process.env.MPESA_CALLBACK_URL || process.env.APP_URL + '/api/mpesa/callback';
    if (!callbackUrl)
        throw new Error("Callback URL not defined");
    const data = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: accountRef,
        TransactionDesc: "Payment for Medicine"
    };
    try {
        const response = await axios_1.default.post(url, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
    catch (error) {
        console.error("STK Push Failed:", error.response?.data || error.message);
        throw new Error("STK Push Failed");
    }
};
exports.triggerStkPush = triggerStkPush;
//# sourceMappingURL=stkPush.js.map