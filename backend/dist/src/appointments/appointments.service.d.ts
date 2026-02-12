import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
export declare class AppointmentsService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    getFormData(): Promise<{
        branches: {
            id: string;
            name: string;
        }[];
        services: {
            id: string;
            name: string;
        }[];
    }>;
    checkAvailability(branchId: string, doctorId: string, date: string): Promise<{
        busy_slots: {
            start: Date;
        }[];
        message: string;
    }>;
    createBooking(data: any): Promise<any>;
    login(body: any): Promise<{
        success: boolean;
        name: string;
    } | {
        success: boolean;
        name?: undefined;
    }>;
    getAllAppointments(): Promise<({
        branch: {
            id: string;
            name: string;
        };
        service: {
            id: string;
            name: string;
        } | null;
        patient: {
            user: {
                id: string;
                email: string;
                password: string;
                full_name: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
            };
        } & {
            id: string;
            user_id: string;
        };
    } & {
        id: string;
        start_time: Date;
        status: string;
        doctor_name: string | null;
        doctor_email: string | null;
        patient_id: string;
        doctor_id: string | null;
        branch_id: string;
        service_booked_id: string | null;
        service_id: string | null;
        createdAt: Date;
    })[]>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        start_time: Date;
        status: string;
        doctor_name: string | null;
        doctor_email: string | null;
        patient_id: string;
        doctor_id: string | null;
        branch_id: string;
        service_booked_id: string | null;
        service_id: string | null;
        createdAt: Date;
    }>;
    deleteAppointment(id: string): Promise<{
        id: string;
        start_time: Date;
        status: string;
        doctor_name: string | null;
        doctor_email: string | null;
        patient_id: string;
        doctor_id: string | null;
        branch_id: string;
        service_booked_id: string | null;
        service_id: string | null;
        createdAt: Date;
    }>;
    assignDoctor(id: string, doctorName: string, doctorEmail: string): Promise<{
        branch: {
            id: string;
            name: string;
        };
        service: {
            id: string;
            name: string;
        } | null;
        patient: {
            user: {
                id: string;
                email: string;
                password: string;
                full_name: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
            };
        } & {
            id: string;
            user_id: string;
        };
    } & {
        id: string;
        start_time: Date;
        status: string;
        doctor_name: string | null;
        doctor_email: string | null;
        patient_id: string;
        doctor_id: string | null;
        branch_id: string;
        service_booked_id: string | null;
        service_id: string | null;
        createdAt: Date;
    }>;
    patientLogin(phone: string): Promise<{
        success: boolean;
        patientId: string;
        name: string;
    }>;
    getPatientRecords(patientId: string): Promise<({
        branch: {
            id: string;
            name: string;
        };
        service: {
            id: string;
            name: string;
        } | null;
        doctor: {
            id: string;
            user_id: string;
            position: string;
            is_online: boolean;
        } | null;
    } & {
        id: string;
        start_time: Date;
        status: string;
        doctor_name: string | null;
        doctor_email: string | null;
        patient_id: string;
        doctor_id: string | null;
        branch_id: string;
        service_booked_id: string | null;
        service_id: string | null;
        createdAt: Date;
    })[]>;
}
