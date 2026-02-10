import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendBookingNotifications(details: any) {
    console.log(`📤 Sending via Resend API to: ${details.email}`);

    try {
      const response = await this.resend.emails.send({
        from: 'Beavers Hospital <onboarding@resend.dev>',
        to: [details.email],
        subject: 'Appointment Confirmation - Beavers FamilyCare',
        html: `
          <h1>Appointment Confirmation</h1>
          <p>Hello ${details.name},</p>
          <p>Your appointment for <strong>${details.serviceName}</strong> has been received.</p>
          <p><strong>Date:</strong> ${details.date}</p>
          <p><strong>Branch:</strong> ${details.branchName}</p>
        `,
      });

      // 🚨 FIX 1: Check for errors first
      if (response.error) {
        console.error('⚠️ Resend API Error:', response.error);
        return { success: false, error: response.error };
      }

      // 🚨 FIX 2: Access the ID correctly (inside .data)
      console.log('✅ Email sent successfully ID:', response.data?.id);
      return { success: true, id: response.data?.id };

    } catch (error) {
      console.error('⚠️ Resend System Failed:', error);
      return { success: false, error };
    }
  }

  // Keeping this for Doctor alerts
  async sendEmail(to: string, subject: string, html: string, text: string) {
    try {
      await this.resend.emails.send({
        from: 'Beavers Hospital <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html,
        text: text
      });
      console.log(`✅ Alert sent to ${to} via API`);
    } catch (error) {
      console.error(`⚠️ Failed to send alert to ${to}:`, error);
    }
  }
}