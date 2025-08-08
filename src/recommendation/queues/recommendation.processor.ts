// src/recommendation/queues/recommendation.processor.ts
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { RecommendationService } from '../recommendation.service';

@Processor('recommendation-queue')
export class RecommendationProcessor {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Process('recommendation.generate')
  async handleGenerateRecommendation(job: Job) {
    const { userId, embedding } = job.data;
    console.log(`🔄 Processing recommendation for user ${userId}`);

    try {
      const recommendations = await this.recommendationService.generateForUser(
        userId,
        embedding,
      );

      console.log(
        `✅ Got ${recommendations.length} recommendations for user ${userId}`,
      );
      return recommendations;
    } catch (err) {
      console.error(`❌ Failed to process recommendation for ${userId}`, err);
      throw err;
    }
  }
}
