import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Experience } from 'src/experience/entities/experience.entity';

@Injectable()
export class FeedbackCron {
  constructor(
    @InjectRepository(Experience)
    private readonly expRepo: Repository<Experience>,
    @InjectQueue('feedback-request') private readonly queue: Queue,
  ) {}

  @Cron('0 */199 * * * *') // every 5 min
  async enqueueEndedExperiences() {
    const now = new Date(); // fetch current time

    // Find all experiences that have ended
    const endedExperiences = await this.expRepo.find({
      where: { sessionEndTime: LessThan(now) },
      relations: ['bookings', 'bookings.user'],
    });

    // Filter out experiences that have no confirmed bookings
    if (endedExperiences.length === 0) {
      console.log('No ended experiences found');
      return;
    }
    for (const exp of endedExperiences) {
      // find attendees with confirmed bookings
      const confirmedAttendees = exp.bookings.filter(
        (b) => b.status === 'confirmed',
      );
      // If no confirmed attendees, skip this experience
      if (confirmedAttendees.length === 0) continue;

      for (const attendee of confirmedAttendees) {
        await this.queue.add('create', {
          userId: attendee.user.id,
          experienceId: exp.id,
        });
      }
    }
  }
}
