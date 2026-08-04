import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infra/redis/redis.service';
import { getRecommendationCacheKey } from '../utils/cache-key.util';
import { ExperienceRecommendationService } from 'src/experience/experience-recommendation.service';
import { LLMRankingService } from './llm-ranking.service';
import {
  DEFAULT_MOOD_RECOMMENDATION_LIMIT,
  EMBEDDING_CANDIDATE_POOL_SIZE,
  RERANKED_RECOMMENDATION_LIMIT,
} from '../recommendation.constants';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly experienceRecommendationService: ExperienceRecommendationService,
    private readonly redis: RedisService,
    private readonly llmRanking: LLMRankingService,
  ) {}

  // Active path: direct emotion-based matching, no LLM call, no cache. The embedding-based
  // path below exists but nothing currently calls it, see README > Known Gaps.
  async generateForUserByMood(
    userId: string,
    mood: string,
    limit = DEFAULT_MOOD_RECOMMENDATION_LIMIT,
  ) {
    return this.experienceRecommendationService.recommendByEmotion(
      mood,
      userId,
      limit,
    );
  }

  async generateForUser(userId: string, embedding: number[], context?: string) {
    const cacheKey = getRecommendationCacheKey(userId);
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached) return cached;

    const candidates =
      await this.experienceRecommendationService.recommendByEmbedding(
        embedding,
        EMBEDDING_CANDIDATE_POOL_SIZE,
      );

    let recommendations = candidates;
    if (context) {
      const rankedIds = await this.llmRanking.rerank(context, candidates);

      recommendations = rankedIds
        .map((id) => candidates.find((c) => c.id === id))
        .filter(Boolean)
        .slice(0, RERANKED_RECOMMENDATION_LIMIT) as any[];
    }

    // Cache until midnight, mood/context shifts often enough that a longer TTL would go stale.
    const secondsUntilMidnight = Math.floor(
      (new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000,
    );
    await this.redis.set(cacheKey, recommendations, secondsUntilMidnight);

    return recommendations;
  }
}
