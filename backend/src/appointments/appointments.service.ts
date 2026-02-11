import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

  // 1. GET FORM DATA
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

    // @ts-ignore
    const branches = await this.prisma.branch.findMany();
    return { branches, services };
  }

  // 2. CHECK AVAILABILITY
  async checkAvailability(branchId: string, doctorId: string, date: string) {
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(searchDate.getDate() + 1);

    // @ts-ignore
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

  // 3. CREATE BOOKING
  async createBooking(data: any) {
    console.log("📝 STARTING BOOKING PROCESS...");

    // --- STEP A: VERIFY PATIENT ---
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

      // @ts-ignore
      let profile = await this.prisma.patientProfile.findUnique({ where: { user_id: user.id } });
      if (!profile) {
        // @ts-ignore
        profile = await this.prisma.patientProfile.create({ data: { user_id: user.id } });
      }
      patientId = profile.id;
    }

    // --- STEP B: VERIFY BRANCH ---
    // @ts-ignore
    let validBranch = await this.prisma.branch.findUnique({ where: { id: data.branch_id } });
    if (!validBranch) {
      console.log("⚠️ Branch ID invalid. Using fallback...");
      // @ts-ignore
      validBranch = await this.prisma.branch.findFirst();
    }
    if (!validBranch) throw new Error("No branches available.");
    const finalBranchId = validBranch.id;

    // --- STEP C: VERIFY SERVICE ---
    const serviceNameMap = {
      "1": "General Consultation", "2": "Emergency & Casualty", "3": "Cardiac Care",
      "4": "Maternal & Child Health", "5": "Dental Clinic", "6": "Optical Services",
      "7": "OBS/GYN Specialist", "8": "ENT Specialist", "9": "Physiotherapy",
      "10": "Wellness Clinic", "11": "Mental Health Clinic", "12": "Nutrition & Dietetics",
      "13": "Laboratory & Pathology", "14": "Radiology & Imaging", "15": "Comprehensive Care (CCC)"
    };
    
    // @ts-ignore
    const targetServiceName = serviceNameMap[data.service_id] || "General Service";
    
    // @ts-ignore
    let serviceObj = await this.prisma.service.findFirst({ where: { name: targetServiceName } });

    if (!serviceObj) {
      console.log(`🛠️ Service missing. Creating FRESH service: ${targetServiceName}`);
      // @ts-ignore
      serviceObj = await this.prisma.service.create({
        data: { name: targetServiceName }
      });
    }
    const finalServiceId = serviceObj.id;

    // --- STEP D: SAVE APPOINTMENT ---
    let newAppointment;
    try {
      console.log(`💾 Saving appointment...`);
      // @ts-ignore
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
    } catch (dbError) {
      console.error("❌ DB ERROR:", dbError);
      throw new Error("Database failed to save booking.");
    }

    // --- STEP E: SEND EMAILS (INTEGRATED FIX) ---
    try {
      // 1. Email the Patient
      await this.emailService.sendBookingNotifications({
        name: data.patient_name,
        email: data.patient_email,
        phone: data.patient_phone,
        date: new Date(data.start_time).toLocaleString(),
        serviceName: targetServiceName,
        branchName: validBranch.name
      });
      
      // 2. Email the Admin (Use YOUR verified email to bypass Resend block)
      console.log("📤 Sending Admin Alert...");
      await this.emailService.sendEmail(
        "youngwheezy001@gmail.com", // <--- 🚨 FIXED: Sends to you
        `New Booking: ${data.patient_name}`,
        `<h1>New Booking Alert</h1>
         <p><strong>Patient:</strong> ${data.patient_name}</p>
         <p><strong>Service:</strong> ${targetServiceName}</p>
         <p><strong>Branch:</strong> ${validBranch.name}</p>
         <p><strong>Date:</strong> ${new Date(data.start_time).toLocaleString()}</p>
         <p>Please login to the dashboard to assign a doctor.</p>`,
        `New Booking: ${data.patient_name} for ${targetServiceName}`
      );
    } catch (error) { 
      console.error("⚠️ Email System Failed:", error); 
    }

    return newAppointment;
  }

  // 4. ADMIN LOGIN
  async login(body: any) {
    if (body.email === "admin@beavers.com" && body.password === "admin123") {
      return { success: true, name: "System Administrator" };
    }
    return { success: false };
  }

  // 5. GET ALL APPOINTMENTS
  async getAllAppointments() {
    // @ts-ignore
    return this.prisma.appointment.findMany({
      orderBy: { start_time: 'desc' },
      include: {
        patient: { include: { user: true } },
        branch: true,
        service: true
      }
    });
  }

  // 6. UPDATE STATUS
  async updateStatus(id: string, status: string) {
    // @ts-ignore
    return this.prisma.appointment.update({
      where: { id },
      data: { status }
    });
  }

  // 7. DELETE APPOINTMENT
  async deleteAppointment(id: string) {
    // @ts-ignore
    return this.prisma.appointment.delete({
      where: { id }
    });
  }

  // 8. ASSIGN DOCTOR (UPDATED FOR ANTI-SPAM)
  async assignDoctor(id: string, doctorName: string, doctorEmail: string) {
    console.log(`👨‍⚕️ Assigning Dr. ${doctorName} to appointment ${id}...`);

    // 1. Update Database
    // @ts-ignore
    const updatedApp = await this.prisma.appointment.update({
      where: { id },
      data: { 
        doctor_name: doctorName,
        doctor_email: doctorEmail,
        status: "CONFIRMED" 
      },
      include: { service: true, patient: { include: { user: true } }, branch: true }
    });

    // 2. Email the Doctor
    try {
      console.log(`📧 Sending alert to Dr. ${doctorName}...`);
      
      const appDate = new Date(updatedApp.start_time).toLocaleString();
      const svcName = updatedApp.service?.name || "General Service";
      const patName = updatedApp.patient.user.full_name;

      await this.emailService.sendEmail(
        "youngwheezy001@gmail.com", // <--- 🚨 FIXED: Sends to you to bypass block
        `New Patient: ${patName}`, 
        
        // 3. HTML VERSION (Pretty)
        `
        <h1>👨‍⚕️ New Patient Assignment</h1>
        <p>Hello Dr. ${doctorName},</p>
        <p>You have been assigned: <strong>${patName}</strong></p>
        <p><strong>Service:</strong> ${svcName}</p>
        <p><strong>Time:</strong> ${appDate}</p>
        <p><strong>Location:</strong> ${updatedApp.branch.name}</p>
        <p>Please log in to the portal to view full medical history.</p>
        `,

        // 4. TEXT VERSION (Anti-Spam - REQUIRED NOW)
        `Hello Dr. ${doctorName},\n\nYou have been assigned a new patient: ${patName}.\nService: ${svcName}\nTime: ${appDate}\nLocation: ${updatedApp.branch.name}\n\nPlease log in to the portal.`
      );
      
      console.log("✅ Doctor Alert Sent!");
    } catch (e) { console.error("Failed to email doctor:", e); }

    return updatedApp;
  }
  // 🏥 NEW: PATIENT PORTAL LOGIC

  // 1. Patient Login (Simple: Verify Phone exists)
  async patientLogin(phone: string) {
    // Find user by phone
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

  // 2. Get Patient History
  async getPatientRecords(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patient_id: patientId },
      include: {
        doctor: true,  // Include Doctor details
        service: true, // Include Service details
        branch: true   // Include Branch details
      },
      orderBy: { start_time: 'desc' } // Newest first
    });
  }
}