import { Injectable } from '@nestjs/common';
import { BookingQueryService } from './booking-query.service';

@Injectable()
export class BookingStatsService {
  constructor(private readonly bookingQueryService: BookingQueryService) {}

  async getTotalBookings(userId: string): Promise<number> {
    return this.bookingQueryService['getOptimizedCount'](userId, 'confirmed');
  }

  async getUpcomingBookings(userId: string): Promise<number> {
    const { data } = await this.bookingQueryService.findAllBookings(
      1,
      200, // high limit to cover user’s bookings
      userId,
      'confirmed',
    );

    const now = new Date();
    return data.filter((b) => new Date(b.experience.date) > now).length;
  }

  async getCompletedBookings(userId: string): Promise<number> {
    const { data } = await this.bookingQueryService.findAllBookings(
      1,
      200,
      userId,
      'confirmed',
    );

    const now = new Date();
    return data.filter((b) => new Date(b.experience.date) <= now).length;
  }
}
