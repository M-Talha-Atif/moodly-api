// src/attendance/attendance.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { NotificationModule } from '../notification/notification.module';

// The AttendanceModule is responsible for managing attendance-related functionality.
// It imports the TypeOrmModule to work with the Attendance entity and the NotificationModule
// to handle notifications related to attendance events.
// The AttendanceController provides endpoints for checking in users, while the AttendanceService
// contains the business logic for processing attendance check-ins.
@Module({
  imports: [TypeOrmModule.forFeature([Attendance]), NotificationModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
