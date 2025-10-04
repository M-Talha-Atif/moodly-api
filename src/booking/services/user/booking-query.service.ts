import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { BookingResponseDto } from 'src/booking/dto/booking-response.dto';
import { BookingMapperService } from './booking-mapper.service';
import { BookingFilterService } from './booking-filter.service';
import { formatDate } from 'src/common/utils/date.utils';

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
  ): Promise<{ data: any[]; total: number }> {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.experience', 'experience')
      .leftJoin('experience.host', 'host')
      .select([
        'booking.id',
        'booking.status',
        'booking.createdAt',
        'experience.id',
        'experience.title',
        'experience.date',
        'experience.image',
        'experience.location',
        'experience.price',
      ])
      .orderBy('booking.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    this.filterService.applyFilters(query, { userId, status, timeFilter });

    const [bookings, total] = await Promise.all([
      query.getMany(),
      this.getOptimizedCount(userId, status, timeFilter),
    ]);

    // format the date before returning
    const data = bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      createdAt: formatDate(booking.createdAt),
      experience: {
        id: booking.experience.id,
        title: booking.experience.title,
        date: formatDate(booking.experience.date),
        image: booking.experience.image,
        location: booking.experience.location,
        price: booking.experience.price,
      },
    }));

    return { data, total };
  }

  // Separate optimized count query
  async getOptimizedCount(
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
