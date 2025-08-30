// src/recommendation/recommendation.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RecommendationService } from './recommendation.service';
import { ExperienceModule } from 'src/experience/experience.module';
import { RedisModule } from 'src/redis/redis.module';
import { RecommendationController } from './recommendation.controller';
import { RecommendationProcessor } from './queues/recommendation.processor';
import { RecommendationQueue } from './queues/recommendation.queue';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { RecommendationGateway } from './recommendation.gateway';

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
  ],
  controllers: [RecommendationController],
  exports: [RecommendationService, RecommendationQueue, RecommendationGateway],
})
export class RecommendationModule {}
