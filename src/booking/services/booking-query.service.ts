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
    console.log(status);
    // Use indexes and select only needed fields
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

  async findBookingById(userId: string, bookingId: string) {
    // Fetches booking detail, host details
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.experience', 'experience')
      .leftJoinAndSelect('experience.host', 'host')
      .leftJoinAndSelect('experience.bookings', 'otherBookings') // all bookings for same experience
      .leftJoinAndSelect('otherBookings.user', 'user') // users of those bookings
      .leftJoinAndSelect('otherBookings.attendance', 'attendance') // their attendance
      .where('booking.id = :bookingId', { bookingId })
      .andWhere('booking.userId = :userId', { userId }) // ensure only owner can fetch
      .getOne();

    if (!booking) {
      return null;
    }

    return this.mapperService.toDetailDto(booking);
  }
}
