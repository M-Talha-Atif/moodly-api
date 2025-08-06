// src/booking/booking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Experience } from '../experience/entities/experience.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    private readonly dataSource: DataSource,
  ) {}

  async createBooking(
    userId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<{ 
    success: boolean; 
    data?: BookingResponseDto; 
    message: string;
    errorType?: 'NOT_FOUND' | 'NO_AVAILABILITY' | 'SERVER_ERROR';
  }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const experience = await queryRunner.manager.findOne(Experience, {
        where: { id: createBookingDto.experienceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!experience) {
        return {
          success: false,
          message: 'Experience not found',
          errorType: 'NOT_FOUND',
        };
      }

      if (experience.spotsFilled >= experience.totalSpots) {
        return {
          success: false,
          message: 'No available spots for this experience',
          errorType: 'NO_AVAILABILITY',
        };
      }

      const booking = queryRunner.manager.create(Booking, {
        experience,
        user: { id: userId },
        status: 'confirmed',
      });

      experience.spotsFilled += 1;

      await queryRunner.manager.save(experience);
      const savedBooking = await queryRunner.manager.save(booking);
      await queryRunner.commitTransaction();

      return {
        success: true,
        data: this.toResponseDto(savedBooking),
        message: 'Booking created successfully',
      };
    } catch ( err ) {
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message: 'Failed to create booking. Please try again.',
        errorType: 'SERVER_ERROR',
      };
    } finally {
      await queryRunner.release();
    }
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