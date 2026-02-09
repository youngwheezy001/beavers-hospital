import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 5000, 
      greetingTimeout: 5000,
    });
  }

  // Changed the name to match what your AppointmentsService is calling
  async sendBookingNotifications(details: any) {
    console.log(`📤 Attempting to send booking notifications for: ${details.email}...`);

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
        to: [details.email, process.env.EMAIL_USER], // Sends to both patient and admin
        subject: 'New Appointment Booking - Beavers FamilyCare',
        text: `New appointment for ${details.name} on ${details.date}`,
        html: htmlContent,
      });
      console.log('✅ Emails sent successfully:', info.messageId);
      return info;
    } catch (error) {
      // The "Safe-Fail" logic to prevent the infinite spinner
      console.warn('⚠️ Email notification failed, but booking is safe:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Keeping the general sendEmail function just in case other parts of your app use it
  async sendEmail(to: string, subject: string, html: string, text: string) {
    try {
      return await this.transporter.sendMail({
        from: `"Beavers FamilyCare" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.warn('⚠️ General email failed:', error.message);
      return { success: false };
    }
  }
}