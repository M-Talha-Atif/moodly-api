// src/mood-log/queues/mood-log-queue.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoodLogEmbedding } from 'src/embedding/schemas/moodlog-embedding.schema';

@Processor('mood-queue')
export class MoodLogQueueProcessor {
  constructor(
    private readonly embeddingService: EmbeddingService,
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
  }
}
