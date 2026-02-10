import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { StaffModule } from './staff/staff.module'; // <--- We import the whole bundle

@Module({
  imports: [
    AppointmentsModule, 
    StaffModule // <--- This loads the Controller & Service automatically
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}