// src/recommendation/queues/recommendation.processor.ts
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { RecommendationService } from '../services/recommendation.service';
import { RecommendationGateway } from '../recommendation.gateway';

@Processor('recommendation-queue')
export class RecommendationProcessor {
  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly recommendationGateway: RecommendationGateway,
  ) {}

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

      // 🔥 Emit via socket
      this.recommendationGateway.sendRecommendations(userId, recommendations);

      return true;
    } catch (err) {
      console.error(`❌ Failed to process recommendation for ${userId}`, err);
      throw err;
    }
  }
}
