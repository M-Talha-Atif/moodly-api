// src/booking/booking.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Experience } from '../experience/entities/experience.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    private readonly dataSource: DataSource,
  ) { }

  async createBooking(
    userId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<{
    success: boolean;
    data?: BookingResponseDto;
    message: string;
    errorType?: string;
  }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction('SERIALIZABLE');

      // 1. Check if experience exists (without lock first)
      const experienceExists = await this.experienceRepository.exist({
        where: { id: createBookingDto.experienceId }
      });

      if (!experienceExists) {
        return {
          success: false,
          message: 'Experience not found',
          errorType: 'NOT_FOUND',
        };
      }

      // 2. Get experience with lock
      const experience = await queryRunner.manager.findOne(Experience, {
        where: { id: createBookingDto.experienceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!experience) {

        return {
          success: false,
          message: 'Experience not found',
          errorType: 'EXPERIENCE_NOT_FOUND',
        };

      }

      // 3. Check availability
      if (experience.spotsFilled >= experience.totalSpots) {
        return {
          success: false,
          message: 'No available spots for this experience',
          errorType: 'NO_AVAILABILITY',
        };
      }

      // 4. Check if user already booked this experience
      const existingBooking = await queryRunner.manager.findOne(Booking, {
        where: {
          user: { id: userId },
          experience: { id: createBookingDto.experienceId }
        }
      });

      if (existingBooking) {
        return {
          success: false,
          message: 'You already booked this experience',
          errorType: 'ALREADY_BOOKED',
        };
      }

      // 5. Create booking
      const booking = queryRunner.manager.create(Booking, {
        experience,
        user: { id: userId },
        status: 'confirmed',
      });



      // 6. Update spots
      experience.spotsFilled += 1;

      // 7. Save changes
      await queryRunner.manager.save(experience);
      const savedBooking = await queryRunner.manager.save(booking);
      await queryRunner.commitTransaction();

      this.logger.log(`Booking created for user ${userId} on experience ${experience.id}`);

      return {
        success: true,
        data: this.toResponseDto(savedBooking),
        message: 'Booking created successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to create booking: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Failed to create booking. Please try again.',
        errorType: 'SERVER_ERROR',
      };
    } finally {
      await queryRunner.release();
    }
  }

  async cancelBooking(
    userId: string,
    bookingId: string,
  ): Promise<{
    success: boolean;
    data?: {
      id: string;
      status: string;
      cancelledAt: Date;
      refundEligible: boolean;
      experience: {
        id: string;
        title: string;
        date: Date;
        availableSpots: number;
        totalSpots: number;
      };
    };
    message: string;
    errorType?: string;
  }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const now = new Date();

    try {
      await queryRunner.startTransaction('SERIALIZABLE');

      // Step 1: Fetch Booking with lock (NO relations)
      const booking = await queryRunner.manager.findOne(Booking, {
        where: { id: bookingId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!booking) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: 'Booking not found',
          errorType: 'NOT_FOUND',
        };
      }

      // Step 2: Fetch Experience with lock
      const experience = await queryRunner.manager.findOne(Experience, {
        where: { id: booking.experienceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!experience) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: 'Associated experience not found',
          errorType: 'EXPERIENCE_NOT_FOUND',
        };
      }

      //  Step 3: Fetch User (no lock needed)
      const user = await queryRunner.manager.findOne(User, {
        where: { id: booking.userId },
      });

      if (!user || user.id !== userId) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: 'You can only cancel your own bookings',
          errorType: 'NOT_OWNER',
        };
      }

      // Step 4: Business validations
      if (booking.status === 'cancelled') {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: 'Booking is already cancelled',
          errorType: 'ALREADY_CANCELLED',
        };
      }

      const experienceDate = new Date(experience.date);
      if (experienceDate < now) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: 'Cannot cancel past experiences',
          errorType: 'EXPERIENCE_PAST',
        };
      }

      const cancellationDeadline = new Date(experienceDate);
      cancellationDeadline.setHours(cancellationDeadline.getHours() - 24);

      if (now > cancellationDeadline) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: 'Cancellations must be made at least 24 hours before the experience',
          errorType: 'CANCELLATION_WINDOW_PASSED',
        };
      }

      if (experience.spotsFilled <= 0) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: 'No spots to release',
          errorType: 'NO_SPOTS_TO_RELEASE',
        };
      }

      // Step 5: Apply changes
      booking.status = 'cancelled';
      booking.cancelledAt = now;
      experience.spotsFilled = Math.max(0, experience.spotsFilled - 1);

      await queryRunner.manager.save(booking);
      await queryRunner.manager.save(experience);
      await queryRunner.commitTransaction();

      this.logger.log(`Booking ${bookingId} cancelled by user ${userId}`);

      return {
        success: true,
        data: {
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
        message: 'Booking cancelled successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to cancel booking ${bookingId}: ${error.message}`, error.stack);

      return {
        success: false,
        message: 'Failed to cancel booking due to server error',
        errorType: 'SERVER_ERROR',
      };
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