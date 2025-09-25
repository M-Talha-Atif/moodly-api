// src/booking/services/host/host-booking-query.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';
import { formatDate } from 'src/common/utils/date.utils';

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

  async findRecentForHost(hostId: string, limit = 5) {
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
}
