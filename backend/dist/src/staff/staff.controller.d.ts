import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(body: any): Promise<{
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
    login(body: any): Promise<{
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
    getAll(): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        role: string;
        department: string | null;
        is_active: boolean;
        created_at: Date;
    }[]>;
    remove(id: string): Promise<{
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
