import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'beaversfamilycare@gmail.com', // Your Gmail
        pass: 'bgnh kfkj thnk kiar',     // Your App Password
      },
      logger: true,
      debug: true, 
    });
  }

  // FIXED: Now accepts 4 arguments (to, subject, html, text)
  async sendEmail(to: string, subject: string, html: string, text: string) {
    try {
      console.log(`📤 Sending to: ${to}`);
      
      const info = await this.transporter.sendMail({
        from: '"Beavers Hospital" <youngwheezy001@gmail.com>',
        to: to,
        subject: subject,
        html: html,
        text: text, // Plain text fallback
      });

      console.log(`✅ Google Accepted: ${info.response}`);
    } catch (error) {
      console.error("❌ Send Failed:", error);
    }
  }

  async sendBookingNotifications(data: any) {
    const { patient_name, patient_email, start_time, service_name, branch_name } = data;

    // 1. Alert Manager
    await this.sendEmail(
      'youngwheezy001@gmail.com',
      '🚨 New Booking Alert',
      `<h1>New Booking</h1><p>Patient: ${patient_name}</p><p>Service: ${service_name}</p>`,
      `New Booking:\nPatient: ${patient_name}\nService: ${service_name}`
    );

    // 2. Alert Patient
    if (patient_email) {
      await this.sendEmail(
        patient_email,
        'Appointment Confirmed',
        `<h1>Confirmed</h1><p>Dear ${patient_name}, your appointment is confirmed.</p>`,
        `Dear ${patient_name}, your appointment is confirmed.`
      );
    }
  }
}