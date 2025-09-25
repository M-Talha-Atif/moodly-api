import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import {
  addDays,
  startOfDay,
  endOfDay,
  nextSaturday,
  nextSunday,
} from 'date-fns';

interface BookingFilters {
  userId?: string;
  status?: 'confirmed' | 'cancelled' | 'waitlisted';
  timeFilter?: 'today' | 'tomorrow' | 'weekend' | 'next-week';
}

@Injectable()
export class BookingFilterService {
  applyFilters(
    query: SelectQueryBuilder<Booking>,
    filters: BookingFilters,
  ): void {
    const { userId, status, timeFilter } = filters;

    if (userId) {
      query.andWhere('booking.userId = :userId', { userId });
    }

    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    if (timeFilter) {
      const { start, end } = this.getTimeRange(timeFilter);
      query.andWhere('experience.date BETWEEN :start AND :end', { start, end });
    }
  }

  private getTimeRange(timeFilter: string): { start: Date; end: Date } {
    const now = new Date();

    switch (timeFilter) {
      case 'today':
        return {
          start: startOfDay(now),
          end: endOfDay(now),
        };
      case 'tomorrow':
        return {
          start: startOfDay(addDays(now, 1)),
          end: endOfDay(addDays(now, 1)),
        };
      case 'weekend':
        return {
          start: startOfDay(nextSaturday(now)),
          end: endOfDay(nextSunday(now)),
        };
      case 'next-week':
        return {
          start: startOfDay(addDays(now, 1)),
          end: endOfDay(addDays(now, 7)),
        };
      default:
        throw new Error(`Invalid time filter: ${timeFilter}`);
    }
  }
}
