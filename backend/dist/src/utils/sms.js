"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAppointmentSMS = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
const sendAppointmentSMS = async (to, patientName, date) => {
    try {
        await client.messages.create({
            body: `Hello ${patientName}, your appointment at Beavers Family Care is confirmed for ${date}. We look forward to seeing you!`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });
        console.log("SMS sent successfully");
    }
    catch (error) {
        console.error("SMS failed to send:", error);
    }
};
exports.sendAppointmentSMS = sendAppointmentSMS;
//# sourceMappingURL=sms.js.map