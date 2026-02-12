import { PrismaService } from '../prisma/prisma.service';
export declare class StaffService {
    private prisma;
    constructor(prisma: PrismaService);
    private generatePassword;
    createStaff(data: {
        name: string;
        email: string;
        role: string;
        department: string;
    }): Promise<{
        generatedPassword: string;
        id: string;
        name: string;
        email: string;
        password: string;
        role: string;
        department: string | null;
        is_active: boolean;
        created_at: Date;
    }>;
    login(email: string, passwordInput: string): Promise<{
        success: boolean;
        staff: {
            id: string;
            name: string;
            email: string;
            password: string;
            role: string;
            department: string | null;
            is_active: boolean;
            created_at: Date;
        };
    }>;
    getAllStaff(): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        role: string;
        department: string | null;
        is_active: boolean;
        created_at: Date;
    }[]>;
    removeStaff(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        role: string;
        department: string | null;
        is_active: boolean;
        created_at: Date;
    }>;
}
