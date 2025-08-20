// src/feedback/pending-feedback.service.ts
import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingFeedback } from './entities/pending-feedback.entity';
import { Feedback } from './entities/feedback.entity';
import { ExperienceService } from '../experience/experience.service';

@Injectable()
export class PendingFeedbackService {
  constructor(
    @InjectRepository(PendingFeedback)
    private readonly pendingRepo: Repository<PendingFeedback>,

    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,

    @Inject(ExperienceService)
    private readonly experienceService: ExperienceService,
  ) { }

  private readonly logger = new Logger(PendingFeedbackService.name);

  // Safe create (idempotent)
  async create(userId: string, experienceId: string) {
    try {
      // 🛑 Skip if feedback already exists
      const feedbackExists = await this.feedbackRepo.exist({
        where: { userId, experienceId },
      });

      if (feedbackExists) {
        this.logger.log(
          `Skipping pending feedback for user=${userId}, exp=${experienceId} (feedback exists)`,
        );
        return;
      }

      //  Get experience title
      const experience = await this.experienceService.findOne(experienceId);
      if (!experience) {
        throw new Error(`Experience with ID ${experienceId} not found`);
      }

      // Insert pending feedback (ignore duplicates)
      await this.pendingRepo
        .createQueryBuilder()
        .insert()
        .into(PendingFeedback)
        .values({
          userId,
          experienceId,
          experienceTitle: experience.title,
        })
        .orIgnore()
        .execute();
    } catch (err) {
      this.logger.error('Failed to create pending feedback', err);
      throw err;
    }
  }

  async findForUser(userId: string) {
    return this.pendingRepo.find({ where: { userId } });
  }

  async deleteById(userId: string, pendingId: string) {
    return this.pendingRepo.delete({ id: pendingId, userId });
  }


  // 🧹 Clean up stale pending feedbacks (cron-safe)
  async cleanupStaleForUser(userId: string) {
    const stale = await this.pendingRepo
      .createQueryBuilder('pf')
      .innerJoin(
        Feedback,
        'f',
        'pf.userId = f.userId AND pf.experienceId = f.experienceId',
      )
      .where('pf.userId = :userId', { userId })
      .getMany();

    if (stale.length > 0) {
      await this.pendingRepo.remove(stale);
      this.logger.log(
        `Cleaned ${stale.length} stale pending feedback(s) for user=${userId}`,
      );
    }
  }
}
