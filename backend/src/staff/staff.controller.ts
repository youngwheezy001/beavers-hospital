import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('create')
  async create(@Body() body: any) {
    return this.staffService.createStaff(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.staffService.login(body.email, body.password);
  }

  @Get('all')
  async getAll() {
    return this.staffService.getAllStaff();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.staffService.removeStaff(id);
  }
}