// src/booking/services/host-booking-stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { Experience } from 'src/experience/entities/experience.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
@Injectable()
export class HostBookingStatsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
  ) {}

  async getTotalBookingsForHost(hostId: string): Promise<number> {
    return this.bookingRepo
      .createQueryBuilder('booking')
      .innerJoin('booking.experience', 'experience')
      .where('experience.hostId = :hostId', { hostId })
      .getCount();
  }

  async getRevenueForHost(hostId: string): Promise<number> {
    const result = await this.bookingRepo
      .createQueryBuilder('booking')
      .innerJoin('booking.experience', 'experience')
      .select('SUM(experience.price)', 'revenue')
      .where('experience.hostId = :hostId', { hostId })
      .andWhere('booking.status = :status', { status: 'confirmed' })
      .getRawOne();

    return Number(result?.revenue || 0);
  }

  async getExperienceCountForHost(hostId: string): Promise<number> {
    return this.experienceRepo.count({ where: { host: { id: hostId } } });
  }

  async getAvgRatingForHost(hostId: string): Promise<number> {
    const result = await this.feedbackRepo
      .createQueryBuilder('feedback')
      .innerJoin('feedback.experience', 'experience')
      .select('AVG(feedback.rating)', 'avg')
      .where('experience.hostId = :hostId', { hostId })
      .getRawOne();

    return Number(result?.avg || 0);
  }
}
