// src/booking/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Experience } from '../experience/entities/experience.entity';
import { DataSource } from 'typeorm';
import { NotificationModule } from '../notification/notification.module'; // Import NotificationModule if needed

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Experience]), // Register both entities
    NotificationModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService], // If you need to use it in other modules
})
export class BookingModule {}
