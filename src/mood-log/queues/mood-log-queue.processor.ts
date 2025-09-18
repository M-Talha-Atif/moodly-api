// src/mood-log/queues/mood-log-queue.processor.ts
import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { EmbeddingService } from 'src/embedding/services/embedding.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoodLogEmbedding } from 'src/embedding/schemas/moodlog-embedding.schema';
import { RecommendationQueue } from 'src/recommendation/queues/recommendation.queue';

@Processor('mood-queue')
export class MoodLogQueueProcessor {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly recommendationQueue: RecommendationQueue,
    @InjectModel(MoodLogEmbedding.name)
    private moodLogEmbeddingModel: Model<MoodLogEmbedding>,
  ) {}

  @Process('mood.logged')
  async handleMoodLogJob(job: Job) {
    const { moodLogId, userId, combinedText } = job.data;

    const embedding =
      await this.embeddingService.generateEmbedding(combinedText);

    await this.moodLogEmbeddingModel.create({
      moodLogId,
      userId,
      embedding,
    });

    console.log(`✅ Processed embedding for moodLog ${moodLogId}`);

    // 🔁 Trigger recommendation job
    await this.recommendationQueue.enqueueGenerateJob(userId, embedding);
  }
}
