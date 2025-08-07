// src/recommendation/queues/recommendation.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { RecommendationService } from '../recommendation.service';

@Processor('recommendation-queue')
export class RecommendationProcessor {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Process('recommendation.generate')
  async handleGenerateRecommendation(job: Job) {
    const { userId, embedding } = job.data;

    console.log(`🔄 Processing recommendation for user ${userId}`);

    const recommendations = await this.recommendationService.generateForUser(userId, embedding);

    // Optional: save to DB or cache is already handled inside service
    return recommendations;
  }
}
