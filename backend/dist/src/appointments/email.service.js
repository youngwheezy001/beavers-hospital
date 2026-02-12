"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailService = class EmailService {
    resend;
    constructor() {
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
    async sendBookingNotifications(details) {
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
            if (response.error) {
                console.error('⚠️ Resend API Error:', response.error);
                return { success: false, error: response.error };
            }
            console.log('✅ Email sent successfully ID:', response.data?.id);
            return { success: true, id: response.data?.id };
        }
        catch (error) {
            console.error('⚠️ Resend System Failed:', error);
            return { success: false, error };
        }
    }
    async sendEmail(to, subject, html, text) {
        try {
            await this.resend.emails.send({
                from: 'Beavers Hospital <onboarding@resend.dev>',
                to: [to],
                subject: subject,
                html: html,
                text: text
            });
            console.log(`✅ Alert sent to ${to} via API`);
        }
        catch (error) {
            console.error(`⚠️ Failed to send alert to ${to}:`, error);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map