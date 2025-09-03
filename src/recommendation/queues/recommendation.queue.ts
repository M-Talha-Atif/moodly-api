// src/recommendation/queues/recommendation.queue.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class RecommendationQueue {
  constructor(@InjectQueue('recommendation-queue') private queue: Queue) {}

  async enqueueGenerateJob(userId: string, embedding: number[]) {
    console.log(`📥 Enqueuing recommendation job for user ${userId}`);

    await this.queue.add('recommendation.generate', {
      userId,
      embedding,
    });

    console.log(`📥 Enqueued recommendation job for user ${userId}`);
  }
}
