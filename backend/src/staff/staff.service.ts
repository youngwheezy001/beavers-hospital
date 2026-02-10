import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto'; // Built-in Node.js crypto for generating passwords

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  // 1. GENERATE RANDOM PASSWORD
  private generatePassword(length = 8) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  // 2. CREATE STAFF (Admin Only)
  async createStaff(data: { name: string; email: string; role: string; department: string }) {
    // Check if email exists
    const existing = await this.prisma.staff.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("Email already registered!");

    // Generate secure password
    const rawPassword = this.generatePassword(); 
    
    // Save to DB (In production, we would Hash this password, but for V1 we store plain to show you)
    const staff = await this.prisma.staff.create({
      data: {
        ...data,
        password: rawPassword, // Store raw for now so you can see it
      }
    });

    return { ...staff, generatedPassword: rawPassword };
  }

  // 3. LOGIN (Doctor)
  async login(email: string, passwordInput: string) {
    const staff = await this.prisma.staff.findUnique({ where: { email } });
    
    if (!staff || !staff.is_active) {
      throw new UnauthorizedException("Account not found or inactive.");
    }

    if (staff.password !== passwordInput) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    return { success: true, staff };
  }

  // 4. LIST ALL STAFF
  async getAllStaff() {
    return this.prisma.staff.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  // 5. REMOVE STAFF
  async removeStaff(id: string) {
    return this.prisma.staff.delete({ where: { id } });
  }
}