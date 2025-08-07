// src/recommendation/recommendation.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RecommendationService } from './recommendation.service';
import { ExperienceModule } from 'src/experience/experience.module';
import { RedisModule } from 'src/redis/redis.module';
import { RecommendationController } from './recommendation.controller';
import { RecommendationProcessor } from './queues/recommendation.processor';
import { RecommendationQueue } from './queues/recommendation.queue';
import { MoodLogModule } from 'src/mood-log/mood-log.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'recommendation-queue',
    }),
    ExperienceModule,
    RedisModule,
    MoodLogModule,
  ],
  providers: [
    RecommendationService,
    RecommendationProcessor,
    RecommendationQueue,
  ],
  controllers: [RecommendationController],
  exports: [RecommendationService, RecommendationQueue],
})
export class RecommendationModule {}
