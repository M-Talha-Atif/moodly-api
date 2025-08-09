// src/booking/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Experience } from '../experience/entities/experience.entity';
import { DataSource } from 'typeorm';
import { NotificationModule } from '../notification/notification.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Experience]), // Register both entities
    NotificationModule,
    AttendanceModule, // Import AttendanceModule to use its services
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService], // If you need to use it in other modules
})
export class BookingModule {}
