// src/attendance/attendance.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { NotificationModule } from '../notification/notification.module';

/**
 * AttendanceModule
 *
 * This module encapsulates all attendance-related functionality,
 * including entity persistence, business logic, and API endpoints.
 *
 * Responsibilities:
 * - Registers the Attendance entity with TypeORM.
 * - Provides AttendanceService for handling business logic (check-ins, status updates, etc.).
 * - Exposes AttendanceController for REST API endpoints.
 * - Integrates with NotificationModule to send notifications
 *   on key attendance-related events (e.g., successful check-in).
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]), // Registers Attendance entity repository
    NotificationModule, // Enables attendance-related notifications
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService], // Makes AttendanceService reusable across other modules
})
export class AttendanceModule {}
