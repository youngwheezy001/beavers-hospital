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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("./email.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    emailService;
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async getFormData() {
        const services = [
            { id: "1", name: "General Consultation" },
            { id: "2", name: "Emergency & Casualty" },
            { id: "3", name: "Cardiac Care" },
            { id: "4", name: "Maternal & Child Health" },
            { id: "5", name: "Dental Clinic" },
            { id: "6", name: "Optical Services" },
            { id: "7", name: "OBS/GYN Specialist" },
            { id: "8", name: "ENT Specialist" },
            { id: "9", name: "Physiotherapy" },
            { id: "10", name: "Wellness Clinic" },
            { id: "11", name: "Mental Health Clinic" },
            { id: "12", name: "Nutrition & Dietetics" },
            { id: "13", name: "Laboratory & Pathology" },
            { id: "14", name: "Radiology & Imaging" },
            { id: "15", name: "Comprehensive Care (CCC)" }
        ];
        const branches = await this.prisma.branch.findMany();
        return { branches, services };
    }
    async checkAvailability(branchId, doctorId, date) {
        const searchDate = new Date(date);
        const nextDay = new Date(searchDate);
        nextDay.setDate(searchDate.getDate() + 1);
        const bookings = await this.prisma.appointment.findMany({
            where: {
                branch_id: branchId,
                start_time: { gte: searchDate, lt: nextDay },
                status: { not: 'CANCELLED' },
            },
            select: { start_time: true },
        });
        return {
            busy_slots: bookings.map(b => ({ start: b.start_time })),
            message: bookings.length > 0 ? "Slots taken" : "Free"
        };
    }
    async createBooking(data) {
        console.log("📝 STARTING BOOKING PROCESS...");
        let patientId = data.patient_id;
        if (!patientId && data.patient_name) {
            let user = await this.prisma.user.findUnique({ where: { email: data.patient_email } });
            if (!user) {
                console.log("👤 Creating new user for patient...");
                user = await this.prisma.user.create({
                    data: {
                        full_name: data.patient_name,
                        email: data.patient_email,
                        password: "guest_password_123",
                        role: "PATIENT",
                        phone: data.patient_phone || "0000000000"
                    }
                });
            }
            let profile = await this.prisma.patientProfile.findUnique({ where: { user_id: user.id } });
            if (!profile) {
                profile = await this.prisma.patientProfile.create({ data: { user_id: user.id } });
            }
            patientId = profile.id;
        }
        let validBranch = await this.prisma.branch.findUnique({ where: { id: data.branch_id } });
        if (!validBranch) {
            console.log("⚠️ Branch ID invalid. Using fallback...");
            validBranch = await this.prisma.branch.findFirst();
        }
        if (!validBranch)
            throw new Error("No branches available.");
        const finalBranchId = validBranch.id;
        const serviceNameMap = {
            "1": "General Consultation", "2": "Emergency & Casualty", "3": "Cardiac Care",
            "4": "Maternal & Child Health", "5": "Dental Clinic", "6": "Optical Services",
            "7": "OBS/GYN Specialist", "8": "ENT Specialist", "9": "Physiotherapy",
            "10": "Wellness Clinic", "11": "Mental Health Clinic", "12": "Nutrition & Dietetics",
            "13": "Laboratory & Pathology", "14": "Radiology & Imaging", "15": "Comprehensive Care (CCC)"
        };
        const targetServiceName = serviceNameMap[data.service_id] || "General Service";
        let serviceObj = await this.prisma.service.findFirst({ where: { name: targetServiceName } });
        if (!serviceObj) {
            console.log(`🛠️ Service missing. Creating FRESH service: ${targetServiceName}`);
            serviceObj = await this.prisma.service.create({
                data: { name: targetServiceName }
            });
        }
        const finalServiceId = serviceObj.id;
        let newAppointment;
        try {
            console.log(`💾 Saving appointment...`);
            newAppointment = await this.prisma.appointment.create({
                data: {
                    start_time: new Date(data.start_time),
                    status: 'PENDING',
                    patient: { connect: { id: patientId } },
                    branch: { connect: { id: finalBranchId } },
                    service: { connect: { id: finalServiceId } }
                }
            });
            console.log("✅ DB Save SUCCESS! ID:", newAppointment.id);
        }
        catch (dbError) {
            console.error("❌ DB ERROR:", dbError);
            throw new Error("Database failed to save booking.");
        }
        try {
            await this.emailService.sendBookingNotifications({
                name: data.patient_name,
                email: data.patient_email,
                phone: data.patient_phone,
                date: new Date(data.start_time).toLocaleString(),
                serviceName: targetServiceName,
                branchName: validBranch.name
            });
            console.log("📤 Sending Admin Alert...");
            await this.emailService.sendEmail("youngwheezy001@gmail.com", `New Booking: ${data.patient_name}`, `<h1>New Booking Alert</h1>
         <p><strong>Patient:</strong> ${data.patient_name}</p>
         <p><strong>Service:</strong> ${targetServiceName}</p>
         <p><strong>Branch:</strong> ${validBranch.name}</p>
         <p><strong>Date:</strong> ${new Date(data.start_time).toLocaleString()}</p>
         <p>Please login to the dashboard to assign a doctor.</p>`, `New Booking: ${data.patient_name} for ${targetServiceName}`);
        }
        catch (error) {
            console.error("⚠️ Email System Failed:", error);
        }
        return newAppointment;
    }
    async login(body) {
        if (body.email === "admin@beavers.com" && body.password === "admin123") {
            return { success: true, name: "System Administrator" };
        }
        return { success: false };
    }
    async getAllAppointments() {
        return this.prisma.appointment.findMany({
            orderBy: { start_time: 'desc' },
            include: {
                patient: { include: { user: true } },
                branch: true,
                service: true
            }
        });
    }
    async updateStatus(id, status) {
        return this.prisma.appointment.update({
            where: { id },
            data: { status }
        });
    }
    async deleteAppointment(id) {
        return this.prisma.appointment.delete({
            where: { id }
        });
    }
    async assignDoctor(id, doctorName, doctorEmail) {
        console.log(`👨‍⚕️ Assigning Dr. ${doctorName} to appointment ${id}...`);
        const updatedApp = await this.prisma.appointment.update({
            where: { id },
            data: {
                doctor_name: doctorName,
                doctor_email: doctorEmail,
                status: "CONFIRMED"
            },
            include: { service: true, patient: { include: { user: true } }, branch: true }
        });
        try {
            console.log(`📧 Sending alert to Dr. ${doctorName}...`);
            const appDate = new Date(updatedApp.start_time).toLocaleString();
            const svcName = updatedApp.service?.name || "General Service";
            const patName = updatedApp.patient.user.full_name;
            await this.emailService.sendEmail("youngwheezy001@gmail.com", `New Patient: ${patName}`, `
        <h1>👨‍⚕️ New Patient Assignment</h1>
        <p>Hello Dr. ${doctorName},</p>
        <p>You have been assigned: <strong>${patName}</strong></p>
        <p><strong>Service:</strong> ${svcName}</p>
        <p><strong>Time:</strong> ${appDate}</p>
        <p><strong>Location:</strong> ${updatedApp.branch.name}</p>
        <p>Please log in to the portal to view full medical history.</p>
        `, `Hello Dr. ${doctorName},\n\nYou have been assigned a new patient: ${patName}.\nService: ${svcName}\nTime: ${appDate}\nLocation: ${updatedApp.branch.name}\n\nPlease log in to the portal.`);
            console.log("✅ Doctor Alert Sent!");
        }
        catch (e) {
            console.error("Failed to email doctor:", e);
        }
        return updatedApp;
    }
    async patientLogin(phone) {
        const user = await this.prisma.user.findFirst({
            where: { phone: phone },
            include: { patient: true }
        });
        if (!user || !user.patient) {
            throw new Error("Patient record not found. Please book an appointment first.");
        }
        return {
            success: true,
            patientId: user.patient.id,
            name: user.full_name
        };
    }
    async getPatientRecords(patientId) {
        return this.prisma.appointment.findMany({
            where: { patient_id: patientId },
            include: {
                doctor: true,
                service: true,
                branch: true
            },
            orderBy: { start_time: 'desc' }
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map