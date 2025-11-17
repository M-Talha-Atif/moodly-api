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

  // 1st approach, no llm call

  async generateForUserByMood(userId: string, mood: string, limit = 10) {
    // const cacheKey = getRecommendationCacheKey(userId);
    // console.log(mood)
    // const cached = await this.redis.get<any[]>(cacheKey);
    // if (cached != null) {
    //   console.log("returned cached results")
    //   return cached;
    // }

    // Direct emotion-based matching (fast, no LLM)
    const recommendations =
      await this.experienceRecommendationService.recommendByEmotion(
        mood,
        userId,
        limit,
      );

    // Cache until midnight
    // const secondsUntilMidnight = Math.floor(
    //   (new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000,
    // );
    // await this.redis.set(cacheKey, recommendations, 60);

    console.log(recommendations);

    return recommendations;
  }

  // 2nd approach

  async generateForUser(userId: string, embedding: number[], context?: string) {
    const cacheKey = getRecommendationCacheKey(userId);
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached) return cached;

    // Step 1: fast ANN search
    const candidates =
      await this.experienceRecommendationService.recommendByEmbedding(
        embedding,
        25,
      );

    // Step 2: rerank with LLM (if context available)
    let recommendations = candidates;
    if (context) {
      const rankedIds = await this.llmRanking.rerank(context, candidates);

      recommendations = rankedIds
        .map((id) => candidates.find((c) => c.id === id))
        .filter(Boolean)
        .slice(0, 10) as any[];
    }

    // Step 3: cache until midnight
    const secondsUntilMidnight = Math.floor(
      (new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000,
    );
    await this.redis.set(cacheKey, recommendations, secondsUntilMidnight);

    return recommendations;
  }
}
