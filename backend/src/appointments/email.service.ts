import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Must be true for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // 🚨 CRITICAL FIX: Force IPv4 to prevent Render timeouts
      family: 4, 
      tls: {
        rejectUnauthorized: false // Helps avoid some strict SSL errors
      },
      connectionTimeout: 20000, // 10 seconds
      greetingTimeout: 20000,
    } as any); // 👈 THIS 'as any' FIXES THE TYPESCRIPT ERROR
  }

  async sendBookingNotifications(details: any) {
    console.log(`📤 Preparing email for: ${details.email}`);

    if (!details.email) {
        console.error("❌ ERROR: No email address provided!");
        return { success: false, error: "No email provided" };
    }

    const htmlContent = `
      <h1>Appointment Confirmation</h1>
      <p>Hello ${details.name},</p>
      <p>Your appointment for <strong>${details.serviceName}</strong> has been received.</p>
      <p><strong>Date:</strong> ${details.date}</p>
      <p><strong>Branch:</strong> ${details.branchName}</p>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"Beavers FamilyCare" <${process.env.EMAIL_USER}>`,
        to: details.email,
        subject: 'Appointment Confirmation - Beavers FamilyCare',
        text: `Hello ${details.name}, your appointment is confirmed.`,
        html: htmlContent,
      });
      console.log('✅ Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.warn('⚠️ Email failed, but booking is saved:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Keeping this for the Doctor alerts
  async sendEmail(to: string, subject: string, html: string, text: string) {
    try {
        await this.transporter.sendMail({
            from: `"Beavers FamilyCare" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log(`✅ Alert sent to ${to}`);
    } catch (error) {
        console.warn(`⚠️ Failed to send alert to ${to}:`, error.message);
    }
  }
}