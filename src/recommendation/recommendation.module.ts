// src/recommendation/recommendation.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RecommendationService } from './services/recommendation.service';
import { ExperienceModule } from 'src/experience/experience.module';
import { RedisModule } from 'src/redis/redis.module';
import { RecommendationController } from './recommendation.controller';
import { RecommendationProcessor } from './queues/recommendation.processor';
import { RecommendationQueue } from './queues/recommendation.queue';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { RecommendationGateway } from './recommendation.gateway';
import { LLMRankingService } from './services/llm-ranking.service';
// 👇 new providers
import { OpenAIRankingProvider } from './providers/openai-ranking.provider';
import { GeminiRankingProvider } from './providers/gemini-ranking.provider';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'recommendation-queue',
    }),
    ExperienceModule,
    RedisModule,
    EmbeddingModule,
  ],
  providers: [
    RecommendationService,
    RecommendationProcessor,
    RecommendationQueue,
    RecommendationGateway,
    LLMRankingService,
    OpenAIRankingProvider,
    GeminiRankingProvider,
  ],
  controllers: [RecommendationController],
  exports: [
    RecommendationService,
    RecommendationQueue,
    RecommendationGateway,
    LLMRankingService,
  ],
})
export class RecommendationModule {}
