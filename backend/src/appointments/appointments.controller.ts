import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('form-data')
  getFormData() {
    return this.appointmentsService.getFormData();
  }

  @Post('check-availability')
  checkAvailability(@Body() body: any) {
    return this.appointmentsService.checkAvailability(body.branch_id, body.doctor_id, body.date);
  }

  @Post('book')
  book(@Body() body: any) {
    return this.appointmentsService.createBooking(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.appointmentsService.login(body);
  }

  @Get('all')
  getAll() {
    return this.appointmentsService.getAllAppointments();
  }

  @Patch(':id/status') // Update Status
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }

  @Delete(':id') // Delete Appointment
  deleteAppointment(@Param('id') id: string) {
    return this.appointmentsService.deleteAppointment(id);
  }
  @Patch(':id/assign')
  assignDoctor(
    @Param('id') id: string, 
    @Body() body: { doctorName: string; doctorEmail: string }
  ) {
    return this.appointmentsService.assignDoctor(id, body.doctorName, body.doctorEmail);
  }
}