import { Injectable, Logger } from '@nestjs/common';
import { Booking } from '../entities/booking.entity';
import { Experience } from '../../experience/entities/experience.entity';
import { User } from '../../users/entities/user.entity';
import { NotificationService } from '../../notification/notification.service';
import { AttendanceService } from '../../attendance/attendance.service';

@Injectable()
export class BookingSideEffectsService {
  private readonly logger = new Logger(BookingSideEffectsService.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly attendanceService: AttendanceService,
  ) {}

  queueBookingCreatedSideEffects(booking: Booking, userId: string): void {
    this.queueAttendanceCreation(booking);
    this.queueBookingConfirmedNotification(userId, booking);
  }

  queueBookingCancelledNotification(
    userId: string,
    user: User,
    experience: Experience,
  ): void {
    this.queueNotification({
      userId,
      email: user?.email ?? null,
      title: 'Booking Cancelled',
      type: 'booking_cancel',
      message: `Your booking for ${experience.title} has been cancelled.`,
    });
  }

  private queueAttendanceCreation(booking: Booking): void {
    this.attendanceService
      .createAttendance(booking.user, booking.id, booking.experience)
      .catch((err) =>
        this.logger.error(`Attendance creation error: ${err.message}`),
      );
  }

  private queueBookingConfirmedNotification(
    userId: string,
    booking: Booking,
  ): void {
    this.queueNotification({
      userId,
      email: booking.user?.email ?? null,
      title: 'Booking Confirmed',
      type: 'booking_confirm',
      message: `Your booking for ${booking.experience.title} is confirmed.`,
    });
  }

  private queueNotification(data: {
    userId: string;
    email: string;
    title: string;
    type: string;
    message: string;
  }): void {
    this.notificationService
      .createAndSend(data)
      .catch((err) => this.logger.error(`Notification error: ${err.message}`));
  }
}
