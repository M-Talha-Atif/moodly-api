import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Experience } from 'src/experience/entities/experience.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceEmbedding } from 'src/embedding/schemas/experience-embedding.schema';

// Pre-defined emotion mapping (production-optimized)
const EMOTION_EXPERIENCE_MAP = {
  // Mood -> Recommended Target Emotions
  happy: ['excited', 'inspired', 'peaceful', 'calm', 'happy'],
  sad: ['peaceful', 'calm', 'inspired', 'happy', 'excited'],
  angry: ['calm', 'peaceful', 'relaxed', 'happy'],
  fearful: ['calm', 'peaceful', 'safe', 'happy'],
  fear: ['calm', 'peaceful', 'safe', 'happy'],
  disgusted: ['calm', 'peaceful', 'inspired', 'happy'],
  surprised: ['happy', 'excited', 'inspired', 'calm'],
  neutral: ['happy', 'calm', 'inspired', 'peaceful', 'excited'],
  anxious: ['calm', 'peaceful', 'relaxed', 'happy'],
};

@Injectable()
export class ExperienceRecommendationService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
    @InjectModel(ExperienceEmbedding.name)
    private readonly experienceEmbeddingModel: Model<ExperienceEmbedding>,
  ) {}

  // first joining then select the columns
  async recommendByEmotion(
    userMood: string,
    userId?: string,
    limit = 10,
  ): Promise<Experience[]> {
    const targetEmotions =
      EMOTION_EXPERIENCE_MAP[userMood] || EMOTION_EXPERIENCE_MAP.neutral;

    const pgArray = `{${targetEmotions.join(',')}}`;

    const queryBuilder = this.experienceRepo
      .createQueryBuilder('exp')
      .leftJoin('exp.host', 'host') // Change to leftJoin (not leftJoinAndSelect)
      .select([
        'exp.id',
        'exp.title',
        'exp.description',
        'exp.date',
        'exp.location',
        'exp.image',
        'exp.isVirtual',
        'exp.sessionStartTime',
        'exp.sessionEndTime',
        'exp.price',
        'exp.timezone',
        'exp.totalSpots',
        'exp.spotsFilled',
        'exp.targetEmotions',
        'exp.desiredOutcomes',
        'exp.culturalTags',
        'exp.language',
        'exp.createdAt',
        'host.id',
        'host.name',
        'host.avatarUrl',
      ])
      .where('exp.targetEmotions && :targetEmotions::text[]', {
        targetEmotions: pgArray,
      })
      .andWhere('exp.spotsFilled < exp.totalSpots')
      .andWhere('exp.sessionStartTime > NOW()');

    if (userId) {
      queryBuilder
        .leftJoin(
          'exp.bookings',
          'userBooking',
          'userBooking.userId = :userId AND userBooking.status != :cancelledStatus',
          {
            userId,
            cancelledStatus: 'cancelled',
          },
        )
        .andWhere('userBooking.id IS NULL');
    }

    queryBuilder
      .orderBy('exp.spotsFilled', 'ASC')
      .addOrderBy('exp.createdAt', 'DESC')
      .take(limit);

    return await queryBuilder.getMany();
  }

  // async recommendByEmotion(
  //   userMood: string,
  //   userId?: string,
  //   limit = 10,
  // ): Promise<Experience[]> {
  //   const targetEmotions =
  //     EMOTION_EXPERIENCE_MAP[userMood] || EMOTION_EXPERIENCE_MAP.neutral;

  //   // Convert JS array -> Postgres array literal: "{happy,calm}"
  //   const pgArray = `{${targetEmotions.join(',')}}`;

  //   const queryBuilder = this.experienceRepo
  //     .createQueryBuilder('exp')
  //     .leftJoinAndSelect('exp.host', 'host')
  //     .where('exp.targetEmotions && :targetEmotions::text[]', {
  //       targetEmotions: pgArray,
  //     })
  //     .andWhere('exp.spotsFilled < exp.totalSpots')
  //     .andWhere('exp.sessionStartTime > NOW()');

  //   if (userId) {
  //     queryBuilder
  //       .leftJoin(
  //         'exp.bookings',
  //         'userBooking',
  //         'userBooking.userId = :userId AND userBooking.status != :cancelledStatus',
  //         {
  //           userId,
  //           cancelledStatus: 'cancelled',
  //         },
  //       )
  //       .andWhere('userBooking.id IS NULL');
  //   }

  //   queryBuilder
  //     .orderBy('exp.spotsFilled', 'ASC')
  //     .addOrderBy('exp.createdAt', 'DESC')
  //     .take(limit);

  //   return await queryBuilder.getMany();
  // }

  // === APPROACH 2: Existing Embedding-Based Recommendation ===
  async recommendByEmbedding(
    userEmbedding: number[],
    limit = 10,
  ): Promise<Experience[]> {
    if (!userEmbedding || userEmbedding.length === 0) return [];

    const similarEmbeddings = await this.experienceEmbeddingModel.aggregate([
      {
        $vectorSearch: {
          queryVector: userEmbedding,
          path: 'embedding',
          numCandidates: 100,
          limit,
          index: 'experience_index',
          metric: 'cosine',
        },
      } as any,
    ]);

    const ids = similarEmbeddings.map((e) => e.experienceId);
    if (!ids.length) return [];

    const exps = await this.experienceRepo.find({
      where: { id: In(ids) },
      relations: ['host'],
    });

    const map = new Map(exps.map((e) => [e.id, e]));
    return ids.map((id) => map.get(id)).filter(Boolean) as Experience[];
  }
}
