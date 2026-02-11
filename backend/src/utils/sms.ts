import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendAppointmentSMS = async (to: string, patientName: string, date: string) => {
  try {
    await client.messages.create({
      body: `Hello ${patientName}, your appointment at Beavers Family Care is confirmed for ${date}. We look forward to seeing you!`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio virtual number or Alphanumeric Sender ID
      to: to // Must be in E.164 format (e.g., +254700000000)
    });
    console.log("SMS sent successfully");
  } catch (error) {
    console.error("SMS failed to send:", error);
  }
};