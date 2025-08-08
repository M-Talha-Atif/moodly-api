// src/feedback/feedback.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { User } from '../users/entities/user.entity';
import { Experience } from '../experience/entities/experience.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
  ) { }

  async create(dto: CreateFeedbackDto, userId: string, experienceId: string) {
    // Verify existence
    const [userExists, experienceExists] = await Promise.all([
      this.userRepository.exist({ where: { id: userId } }),
      this.experienceRepository.exist({ where: { id: experienceId } }),
    ]);

    if (!userExists) throw new NotFoundException('User not found');
    if (!experienceExists) throw new NotFoundException('Experience not found');

    // METHOD 1: Using query runner for absolute control
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Insert using exact column names
      const result = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Feedback)
        .values({
          comment: dto.comment,
          rating: dto.rating,
          userId: userId, // Explicit column value
          experienceId: experienceId, // Explicit column value
        })
        .returning(['id'])
        .execute();

      // Commit transaction
      await queryRunner.commitTransaction();

      // Return full feedback with relations
      return this.feedbackRepository.findOne({
        where: { id: result.identifiers[0].id },
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