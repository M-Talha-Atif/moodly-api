// src/mood-log/queues/mood-log-queue.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MoodLogQueueProcessor } from './mood-log-queue.processor';
import { EmbeddingModule } from '../../embedding/embedding.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mood-queue', // name of the queue
    }),
    EmbeddingModule, // Add this line
  ],
  providers: [MoodLogQueueProcessor],
  exports: [BullModule], // So other modules can use it
})
export class MoodLogQueueModule {}
