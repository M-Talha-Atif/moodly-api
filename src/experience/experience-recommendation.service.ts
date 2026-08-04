import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Experience } from 'src/experience/entities/experience.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceEmbedding } from 'src/embedding/schemas/experience-embedding.schema';
import { RecommendationResponseDto } from './dto/recommendation-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  DEFAULT_EXPERIENCE_RECOMMENDATION_LIMIT,
  VECTOR_SEARCH_CANDIDATE_POOL,
} from './experience.constants';

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

  async recommendByEmotion(
    userMood: string,
    userId?: string,
    limit = DEFAULT_EXPERIENCE_RECOMMENDATION_LIMIT,
  ): Promise<RecommendationResponseDto[]> {
    const targetEmotions =
      EMOTION_EXPERIENCE_MAP[userMood] || EMOTION_EXPERIENCE_MAP.neutral;

    const queryBuilder = this.experienceRepo
      .createQueryBuilder('exp')
      .select([
        'exp.id',
        'exp.title',
        'exp.image',
        'exp.price',
        'exp.targetEmotions',
        'exp.totalSpots',
        'exp.spotsFilled',
        'exp.createdAt',
      ])
      // Calculate match score: count of matching emotions
      .addSelect(
        `(
        SELECT COUNT(*)::integer
        FROM unnest(exp."targetEmotions") AS emotion
        WHERE emotion = ANY(:targetEmotions)
      )`,
        'match_score', // Changed from "matchScore" to match_score
      )
      .where('exp."targetEmotions" && :targetEmotions', {
        targetEmotions,
      })
      .andWhere('exp."spotsFilled" < exp."totalSpots"')
      .andWhere('exp."sessionStartTime" > NOW()');

    // Exclude user's existing bookings
    if (userId) {
      queryBuilder
        .leftJoin(
          'exp.bookings',
          'userBooking',
          'userBooking.userId = :userId AND userBooking.status != :cancelledStatus',
          { userId, cancelledStatus: 'cancelled' },
        )
        .andWhere('userBooking.id IS NULL');
    }

    // Order by - use the exact alias without quotes
    queryBuilder
      .orderBy('match_score', 'DESC') // Changed to match the alias
      .addOrderBy('exp."totalSpots" - exp."spotsFilled"', 'DESC')
      .addOrderBy('exp."createdAt"', 'DESC')
      .limit(limit);

    const rawResults = await queryBuilder.getRawMany();

    // Transform results to include the best matching emotion
    return rawResults.map((result) => {
      const allEmotions = result.exp_targetEmotions || [];

      // Find the first matching emotion based on priority
      const bestMatchEmotion =
        targetEmotions.find((emotion) => allEmotions.includes(emotion)) ||
        allEmotions[0];

      return plainToInstance(
        RecommendationResponseDto,
        {
          id: result.exp_id,
          title: result.exp_title,
          image: result.exp_image,
          price: result.exp_price,
          targetEmotion: bestMatchEmotion,
        },
        { excludeExtraneousValues: true },
      );
    });
  }

  async recommendByEmbedding(
    userEmbedding: number[],
    limit = DEFAULT_EXPERIENCE_RECOMMENDATION_LIMIT,
  ): Promise<Experience[]> {
    if (!userEmbedding || userEmbedding.length === 0) return [];

    const similarEmbeddings = await this.experienceEmbeddingModel.aggregate([
      {
        $vectorSearch: {
          queryVector: userEmbedding,
          path: 'embedding',
          numCandidates: VECTOR_SEARCH_CANDIDATE_POOL,
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
