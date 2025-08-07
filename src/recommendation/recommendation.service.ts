import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { getRecommendationCacheKey } from './utils/cache-key.util';
import { ExperienceRecommendationService } from 'src/experience/experience-recommendation.service';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly experienceRecommendationService: ExperienceRecommendationService,
    private readonly redis: RedisService,
  ) {}

  async generateForUser(userId: string, embedding: number[]) {
    const cacheKey = getRecommendationCacheKey(userId);

    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached) {
      console.log(`🧠 Cache hit for ${userId}`);
      return cached;
    }

    const recommendations =
      await this.experienceRecommendationService.recommend(embedding, 10);

    const secondsUntilMidnight = Math.floor(
      (new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000,
    );

    await this.redis.set(cacheKey, recommendations, secondsUntilMidnight);

    return recommendations;
  }
}
