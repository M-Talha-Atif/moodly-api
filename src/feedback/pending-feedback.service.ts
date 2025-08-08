import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingFeedback } from './entities/pending-feedback.entity';

@Injectable()
export class PendingFeedbackService {
  constructor(
    @InjectRepository(PendingFeedback)
    private repo: Repository<PendingFeedback>,
  ) {}

  private readonly logger = new Logger(PendingFeedbackService.name);

  // create but ignore duplicate (idempotent)
  async create(userId: string, experienceId: string) {
    try {
      // Insert directly; will throw on duplicate unique index
      await this.repo
        .createQueryBuilder()
        .insert()
        .into(PendingFeedback)
        .values({ userId, experienceId })
        .orIgnore() // if using Postgres + TypeORM, this issues ON CONFLICT DO NOTHING
        .execute();
    } catch (err) {
      this.logger.error('Failed to create pending feedback', err);
      throw err;
    }
  }
  async findForUser(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  async deletePendingIfExists(userId: string, experienceId: string) {
    return this.repo.delete({ userId, experienceId });
  }
}
