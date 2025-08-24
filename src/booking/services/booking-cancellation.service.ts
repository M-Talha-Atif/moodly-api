import { Injectable, Logger } from '@nestjs/common';
import { Booking } from '../entities/booking.entity';
import { Experience } from '../../experience/entities/experience.entity';
import { User } from '../../users/entities/user.entity';
import { ResultDto } from '../../common/dto/result.dto';
import { HttpStatus } from '@nestjs/common/enums';
import { BookingErrorHandler } from 'src/booking/services/booking-error-handler.service';
import { TransactionService } from 'src/common/services/transaction.service';
import { BookingValidationService } from 'src/booking/services/booking-validation.service';
import { BookingSideEffectsService } from 'src/booking/services/booking-side-effects.service';
import { AttendanceService } from '../../attendance/attendance.service';
import { ExperienceGateway } from 'src/experience/experience.gateway';

@Injectable()
export class BookingCancellationService {
  private readonly logger = new Logger(BookingCancellationService.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly validationService: BookingValidationService,
    private readonly sideEffectsService: BookingSideEffectsService,
    private readonly errorHandler: BookingErrorHandler,
    private readonly attendanceService: AttendanceService,
    private readonly gateway: ExperienceGateway,
  ) {}

  async cancelBooking(
    userId: string,
    bookingId: string,
  ): Promise<ResultDto<any>> {
    try {
      const { booking, experience, user } =
        await this.transactionService.withTransaction(async (manager) => {
          const now = new Date();

          const booking = await manager.findOne(Booking, {
            where: { id: bookingId },
            lock: { mode: 'pessimistic_write' },
          });

          if (!booking) {
            throw new Error('Booking not found');
          }

          const experience = await manager.findOne(Experience, {
            where: { id: booking.experienceId },
            lock: { mode: 'pessimistic_write' },
          });

          if (!experience) {
            throw new Error('Experience not found');
          }

          const user = await manager.findOne(User, {
            where: { id: booking.userId },
          });

          if (!user || user.id !== userId) {
            throw new Error('You can only cancel your own bookings');
          }

          this.validationService.validateCancellationAllowed(
            booking,
            experience,
            now,
          );

          // Update booking and experience
          booking.status = 'cancelled';
          booking.cancelledAt = now;
          experience.spotsFilled = Math.max(0, experience.spotsFilled - 1);

          await manager.save([booking, experience]);
          await this.attendanceService.deleteByBookingId(booking.id);

          return { booking, experience, user };
        });

      // Queue notification
      this.sideEffectsService.queueBookingCancelledNotification(
        userId,
        user,
        experience,
      );
      const spotsLeft = experience.totalSpots - experience.spotsFilled;
      this.gateway.emitSpotsUpdate(experience.id, spotsLeft);

      return ResultDto.ok(
        {
          id: booking.id,
          status: booking.status,
          cancelledAt: booking.cancelledAt,
          refundEligible: this.isRefundEligible(new Date(experience.date)),
          experience: {
            id: experience.id,
            title: experience.title,
            date: experience.date,
            availableSpots: experience.totalSpots - experience.spotsFilled,
            totalSpots: experience.totalSpots,
          },
        },
        'Booking cancelled successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Cancel failed: ${error.message}`, error.stack);
      return this.errorHandler.handleCancelError(error);
    }
  }

  private isRefundEligible(experienceDate: Date): boolean {
    const refundDeadline = new Date(experienceDate);
    refundDeadline.setHours(refundDeadline.getHours() - 48);
    return new Date() < refundDeadline;
  }
}
