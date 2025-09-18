import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { getRecommendationCacheKey } from '../utils/cache-key.util';
import { ExperienceRecommendationService } from 'src/experience/experience-recommendation.service';
import { LLMRankingService } from './llm-ranking.service';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly experienceRecommendationService: ExperienceRecommendationService,
    private readonly redis: RedisService,
    private readonly llmRanking: LLMRankingService,
  ) {}

  async generateForUser(userId: string, embedding: number[], context?: string) {
    const cacheKey = getRecommendationCacheKey(userId);
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached) return cached;

    // Step 1: fast ANN search
    const candidates = await this.experienceRecommendationService.recommend(
      embedding,
      50,
    );

    // Step 2: rerank with LLM (if context available)
    let recommendations = candidates;
    if (context) {
      const rankedIds = await this.llmRanking.rerank(context, candidates);

      recommendations = rankedIds
        .map((id) => candidates.find((c) => c.id === id))
        .filter(Boolean) as any[];
    }

    // Step 3: cache until midnight
    const secondsUntilMidnight = Math.floor(
      (new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000,
    );
    await this.redis.set(cacheKey, recommendations, secondsUntilMidnight);

    return recommendations;
  }
}
