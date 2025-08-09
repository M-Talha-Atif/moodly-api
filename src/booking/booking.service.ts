// src/booking/booking.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Experience } from '../experience/entities/experience.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotificationService } from '../notification/notification.service';
import { BookingResponseDto } from './dto/booking-response.dto';
import { AttendanceService } from '../attendance/attendance.service';
import { ResultDto } from '../common/dto/result.dto';
import { HttpStatus } from '@nestjs/common/enums';
import { ERROR_CODE_MAP } from '../common/constants/error-code-map';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,

    private readonly dataSource: DataSource,

    private readonly notificationService: NotificationService,

    private readonly attendanceService: AttendanceService,
  ) {}

  async createBooking(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<ResultDto<BookingResponseDto>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction('SERIALIZABLE');

      const exists = await this.experienceRepository.exist({
        where: { id: dto.experienceId },
      });
      if (!exists) {
        return ResultDto.fail(
          'Experience not found',
          ERROR_CODE_MAP.NOT_FOUND,
          'NOT_FOUND',
        );
      }

      const experience = await queryRunner.manager.findOne(Experience, {
        where: { id: dto.experienceId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!experience) {
        return ResultDto.fail(
          'Experience not found',
          ERROR_CODE_MAP.NOT_FOUND,
          'NOT_FOUND',
        );
      }

      const existingBooking = await queryRunner.manager.findOne(Booking, {
        where: { user: { id: userId }, experience: { id: dto.experienceId } },
        order: { createdAt: 'DESC' },
      });

      if (existingBooking?.status === 'confirmed') {
        return ResultDto.fail(
          'You already booked this experience',
          ERROR_CODE_MAP.ALREADY_BOOKED,
          'ALREADY_BOOKED',
        );
      }

      if (experience.spotsFilled >= experience.totalSpots) {
        return ResultDto.fail(
          'No available spots',
          ERROR_CODE_MAP.NO_AVAILABILITY,
          'NO_AVAILABILITY',
        );
      }

      let savedBooking: Booking;

      if (existingBooking?.status === 'cancelled') {
        existingBooking.status = 'confirmed';
        existingBooking.cancelledAt = null;
        experience.spotsFilled += 1;
        await queryRunner.manager.save([experience, existingBooking]);
        savedBooking = await queryRunner.manager.findOneOrFail(Booking, {
          where: { id: existingBooking.id },
          relations: ['experience', 'user'],
        });
      } else {
        const booking = queryRunner.manager.create(Booking, {
          experience,
          user: { id: userId },
          status: 'confirmed',
        });
        experience.spotsFilled += 1;
        await queryRunner.manager.save(experience);
        const bookingSaved = await queryRunner.manager.save(booking);
        savedBooking = await queryRunner.manager.findOneOrFail(Booking, {
          where: { id: bookingSaved.id },
          relations: ['experience', 'user'],
        });
      }

      await queryRunner.commitTransaction();

      // Fire attendance + notification asynchronously
      this.attendanceService
        .createAttendance(
          savedBooking.user,
          savedBooking.id,
          savedBooking.experience,
        )
        .catch((err) => this.logger.error(`Attendance error: ${err.message}`));

      this.notificationService
        .createAndSend({
          userId,
          email: savedBooking.user?.email ?? null,
          title: 'Booking Confirmed',
          message: `Your booking for ${experience.title} is confirmed.`,
        })
        .catch((err) =>
          this.logger.error(`Notification error: ${err.message}`),
        );

      return ResultDto.ok(
        this.toResponseDto(savedBooking),
        'Booking created successfully',
        ERROR_CODE_MAP.CREATED,
      );
    } catch (error) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      this.logger.error(`Booking failed: ${error?.message}`, error?.stack);
      return ResultDto.fail(
        'Failed to create booking. Please try again.',
        ERROR_CODE_MAP.SERVER_ERROR,
        'SERVER_ERROR',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async cancelBooking(
    userId: string,
    bookingId: string,
  ): Promise<ResultDto<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const now = new Date();

    try {
      await queryRunner.startTransaction('SERIALIZABLE');

      const booking = await queryRunner.manager.findOne(Booking, {
        where: { id: bookingId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!booking) {
        return ResultDto.fail(
          'Booking not found',
          ERROR_CODE_MAP.NOT_FOUND,
          'NOT_FOUND',
        );
      }

      const experience = await queryRunner.manager.findOne(Experience, {
        where: { id: booking.experienceId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!experience) {
        return ResultDto.fail(
          'Experience not found',
          ERROR_CODE_MAP.EXPERIENCE_NOT_FOUND,
          'EXPERIENCE_NOT_FOUND',
        );
      }

      const user = await queryRunner.manager.findOne(User, {
        where: { id: booking.userId },
      });
      if (!user || user.id !== userId) {
        return ResultDto.fail(
          'You can only cancel your own bookings',
          ERROR_CODE_MAP.NOT_OWNER,
          'NOT_OWNER',
        );
      }

      if (booking.status === 'cancelled') {
        return ResultDto.fail(
          'Booking is already cancelled',
          ERROR_CODE_MAP.ALREADY_CANCELLED,
          'ALREADY_CANCELLED',
        );
      }

      const experienceDate = new Date(experience.date);
      if (experienceDate < now) {
        return ResultDto.fail(
          'Cannot cancel past experiences',
          ERROR_CODE_MAP.EXPERIENCE_PAST,
          'EXPERIENCE_PAST',
        );
      }

      const cancellationDeadline = new Date(experienceDate);
      cancellationDeadline.setHours(cancellationDeadline.getHours() - 24);
      if (now > cancellationDeadline) {
        return ResultDto.fail(
          'Cancellations must be at least 24 hours before start',
          ERROR_CODE_MAP.CANCELLATION_WINDOW_PASSED,
          'CANCELLATION_WINDOW_PASSED',
        );
      }

      if (experience.spotsFilled <= 0) {
        return ResultDto.fail(
          'No spots to release',
          ERROR_CODE_MAP.NO_SPOTS_TO_RELEASE,
          'NO_SPOTS_TO_RELEASE',
        );
      }

      booking.status = 'cancelled';
      booking.cancelledAt = now;
      experience.spotsFilled = Math.max(0, experience.spotsFilled - 1);

      await queryRunner.manager.save(booking);
      await queryRunner.manager.save(experience);
      await this.attendanceService.deleteByBookingId(booking.id);
      await queryRunner.commitTransaction();

      this.notificationService
        .createAndSend({
          userId,
          email: user?.email ?? null,
          title: 'Booking Cancelled',
          message: `Your booking for ${experience.title} has been cancelled.`,
        })
        .catch((err) =>
          this.logger.error(`Notification error: ${err.message}`),
        );

      return ResultDto.ok(
        {
          id: booking.id,
          status: booking.status,
          cancelledAt: booking.cancelledAt,
          refundEligible: this.isRefundEligible(experienceDate),
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
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(`Cancel failed: ${error.message}`, error.stack);
      return ResultDto.fail(
        'Failed to cancel booking',
        ERROR_CODE_MAP.SERVER_ERROR,
        'SERVER_ERROR',
      );
    } finally {
      await queryRunner.release();
    }
  }

  private isRefundEligible(experienceDate: Date): boolean {
    const refundDeadline = new Date(experienceDate);
    refundDeadline.setHours(refundDeadline.getHours() - 48);
    return new Date() < refundDeadline;
  }

  private toResponseDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      status: booking.status,
      experience: {
        id: booking.experience.id,
        title: booking.experience.title,
        date: booking.experience.date,
      },
      createdAt: booking.createdAt,
    };
  }
}
