// src/feedback/feedback.service.ts
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Booking } from '../booking/entities/booking.entity';
import { PendingFeedback } from './entities/pending-feedback.entity';
import { ExperienceService } from '../experience/services/experience.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @Inject(ExperienceService)
    private readonly experienceService: ExperienceService,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateFeedbackDto, userId: string, experienceId: string) {
    // Validate booking
    const booking = await this.dataSource.getRepository(Booking).findOne({
      where: {
        user: { id: userId },
        experience: { id: experienceId },
        status: 'confirmed',
      },
      relations: ['experience'],
    });

    if (!booking) {
      throw new NotFoundException(
        'No confirmed booking found for this user and experience',
      );
    }

    // Check session end time
    const now = new Date();
    if (booking.experience.sessionEndTime > now) {
      throw new BadRequestException(
        'You can only leave feedback after the experience has ended',
      );
    }

    // Prevent duplicate feedback
    const alreadyLeftFeedback = await this.feedbackRepository.exist({
      where: { userId, experienceId },
    });
    if (alreadyLeftFeedback) {
      throw new BadRequestException(
        'You have already left feedback for this experience',
      );
    }

    // FIX: properly await experience
    const experience = await this.experienceService.findOne(experienceId);
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    // 4️⃣ Use a transaction for feedback + pending deletion
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ➕ Insert feedback
      const feedbackInsert = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Feedback)
        .values({
          comment: dto.comment,
          rating: dto.rating,
          userId,
          experienceId,
          experienceTitle: experience.title,
        })
        .returning(['id'])
        .execute();

      // ➖ Delete pending feedback entry for this user & experience
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(PendingFeedback)
        .where('userId = :userId AND experienceId = :experienceId', {
          userId,
          experienceId,
        })
        .execute();

      await queryRunner.commitTransaction();

      // Return the newly created feedback with relations
      return this.feedbackRepository.findOne({
        where: { id: feedbackInsert.identifiers[0].id },
        relations: ['user', 'experience'],
        select: {
          id: true,
          comment: true,
          rating: true,
          createdAt: true,
          user: { id: true, name: true, avatarUrl: true },
          experience: { id: true, title: true },
        },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllForExperience(experienceId: string) {
    return this.feedbackRepository.find({
      where: { experience: { id: experienceId } },
      relations: ['user'],
      select: {
        id: true,
        comment: true,
        rating: true,
        createdAt: true,
        user: { id: true, name: true, avatarUrl: true },
      },
    });
  }
}
