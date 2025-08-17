// src/mood-log/queues/mood-log-queue.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MoodLogQueueProcessor } from './mood-log-queue.processor';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { RecommendationModule } from 'src/recommendation/recommendation.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mood-queue',
    }),
    EmbeddingModule,
    RecommendationModule,
  ],
  providers: [MoodLogQueueProcessor],
  exports: [BullModule],
})
export class MoodLogQueueModule {}
