// src/booking/services/host/host-booking-query.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';
import { formatDate } from 'src/common/utils/date.utils';
import {
  DEFAULT_RECENT_BOOKINGS_LIMIT,
  BOOKING_TREND_WINDOW_DAYS,
} from 'src/booking/booking.constants';

@Injectable()
export class HostBookingQueryService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  /**
   * Get all bookings for experiences owned by this host
   */
  async findAllForHost(hostId: string) {
    return this.bookingRepo
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.experience', 'experience')
      .innerJoinAndSelect('booking.user', 'user')
      .where('experience.hostId = :hostId', { hostId })
      .orderBy('booking.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Get detail of a specific booking if it belongs to host’s experience
   */
  async findBookingForHost(hostId: string, bookingId: string) {
    const booking = await this.bookingRepo
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.experience', 'experience')
      .innerJoinAndSelect('booking.user', 'user')
      .where('experience.hostId = :hostId', { hostId })
      .andWhere('booking.id = :bookingId', { bookingId })
      .getOne();

    if (!booking) {
      throw new NotFoundException(
        `Booking ${bookingId} not found for host ${hostId}`,
      );
    }

    return booking;
  }

  /**
   * Get recent bookings (default 5) for host’s experiences
   */
  // src/booking/services/host/host-booking-query.service.ts

  async findRecentForHost(
    hostId: string,
    limit = DEFAULT_RECENT_BOOKINGS_LIMIT,
  ) {
    const bookings = await this.bookingRepo
      .createQueryBuilder('booking')
      .innerJoin('booking.experience', 'experience')
      .innerJoin('booking.user', 'user')
      .where('experience.hostId = :hostId', { hostId })
      .orderBy('booking.createdAt', 'DESC')
      .limit(limit)
      .select([
        'booking.id',
        'booking.status',
        'booking.createdAt',
        'booking.experienceId',
        'experience.id',
        'experience.title',
        'experience.date',
        'experience.price',
        'user.id',
        'user.name',
      ])
      .getMany();

    // Transform into a simplified structure
    return bookings.map((b) => ({
      bookingId: b.id,
      guestName: b.user?.name,
      experienceId: b.experience?.id,
      experienceTitle: b.experience?.title,
      date: formatDate(b.experience?.date),
      amount: b.experience?.price,
      status: b.status,
    }));
  }

  /**
   * Get booking trend for the host's experiences (grouped by date)
   */
  async getBookingTrend(hostId: string, days = BOOKING_TREND_WINDOW_DAYS) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const raw = await this.bookingRepo
      .createQueryBuilder('booking')
      .innerJoin('booking.experience', 'experience')
      .where('experience.hostId = :hostId', { hostId })
      .andWhere('booking.createdAt >= :sinceDate', { sinceDate })
      .andWhere('booking.status = :status', { status: 'confirmed' })
      .select(
        `
      DATE(booking.createdAt) AS date,
      COUNT(*) AS count
    `,
      )
      .groupBy('DATE(booking.createdAt)')
      .orderBy('DATE(booking.createdAt)', 'ASC')
      .getRawMany();

    return raw.map((row) => ({
      date: formatDate(row.date),
      count: Number(row.count),
    }));
  }

  /**
   * Emotional outcomes dashboard scores based ONLY on:
   * - experience.desiredOutcomes[]
   * - weighted by number of bookings
   */
  async getEmotionalOutcomesForHost(hostId: string) {
    const rows = await this.bookingRepo
      .createQueryBuilder('booking')
      .innerJoin('booking.experience', 'experience')
      .where('experience.hostId = :hostId', { hostId })
      .select([
        'experience.desiredOutcomes AS desiredOutcomes',
        'COUNT(booking.id) AS bookingCount',
      ])
      .groupBy('experience.id')
      .getRawMany();

    const tags = ['happiness', 'calmness', 'relief', 'excitement'];

    const totals: Record<string, number> = {
      happiness: 0,
      calmness: 0,
      relief: 0,
      excitement: 0,
    };

    let totalBookings = 0;

    rows.forEach((row) => {
      const bookingCount = Number(row.bookingcount);
      totalBookings += bookingCount;

      const desired: string[] = row.desiredoutcomes || [];

      desired.forEach((d) => {
        if (totals[d] !== undefined) {
          totals[d] += bookingCount; // weight by popularity
        }
      });
    });

    // fallback: no bookings yet → use experiences count
    if (totalBookings === 0) totalBookings = rows.length || 1;

    const scores = tags.map((t) =>
      Number((totals[t] / totalBookings).toFixed(2)),
    );

    return {
      labels: tags.map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
      scores,
    };
  }

  /**
   * Funnel Stages:
   * - booked
   * - rebooked
   * - feedbackGiven
   * - positiveFeedback (rating >= 4)
   * - attended30
   */
  async getFunnelForHost(hostId: string) {
    // 1) Get bookings for this host
    const bookings = await this.bookingRepo
      .createQueryBuilder('booking')
      .innerJoin('booking.experience', 'experience')
      .where('experience.hostId = :hostId', { hostId })
      .select(['booking.id AS bookingId', 'booking.userId AS userId'])
      .getRawMany();

    const booked = bookings.length;

    // 2) Users who booked more than once (re-bookers)
    const bookingCountByUser = new Map<string, number>();
    bookings.forEach((b) => {
      bookingCountByUser.set(
        b.userId,
        (bookingCountByUser.get(b.userId) || 0) + 1,
      );
    });

    const rebooked = [...bookingCountByUser.values()].filter(
      (count) => count > 1,
    ).length;

    return {
      booked,
      rebooked,
    };
  }
}
