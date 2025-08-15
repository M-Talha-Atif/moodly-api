import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { BookingResponseDto } from '../dto/booking-response.dto';
import { BookingMapperService } from './booking-mapper.service';
import { BookingFilterService } from './booking-filter.service';

@Injectable()
export class BookingQueryService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly mapperService: BookingMapperService,
    private readonly filterService: BookingFilterService,
  ) {}

  async findAllBookings(
    page = 1,
    limit = 10,
    userId?: string,
    status?: 'confirmed' | 'cancelled' | 'waitlisted',
    timeFilter?: 'today' | 'tomorrow' | 'weekend' | 'next-week',
  ): Promise<{ data: BookingResponseDto[]; total: number }> {
    // OPTIMIZATION: Use indexes and select only needed fields
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .select([
        'booking.id',
        'booking.status',
        'booking.createdAt',
        'experience.id',
        'experience.title',
        'experience.date',
      ])
      .leftJoin('booking.experience', 'experience')
      .orderBy('booking.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    this.filterService.applyFilters(query, { userId, status, timeFilter });

    // OPTIMIZATION: Use raw query for count to avoid loading all data
    const [bookings, total] = await Promise.all([
      query.getMany(),
      this.getOptimizedCount(userId, status, timeFilter),
    ]);

    return {
      data: bookings.map((booking) =>
        this.mapperService.toResponseDto(booking),
      ),
      total,
    };
  }

  // Separate optimized count query
  private async getOptimizedCount(
    userId?: string,
    status?: 'confirmed' | 'cancelled' | 'waitlisted',
    timeFilter?: 'today' | 'tomorrow' | 'weekend' | 'next-week',
  ): Promise<number> {
    const countQuery = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.experience', 'experience');

    this.filterService.applyFilters(countQuery, { userId, status, timeFilter });

    return countQuery.getCount();
  }
}
