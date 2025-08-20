// src/worker/embedding.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmbeddingService } from '../embedding/embedding.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoodLogEmbedding } from '../embedding/schemas/moodlog-embedding.schema';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

type MoodAnalyzedPayload = {
  moodLogId: string;
  userId: string;
  combinedText: string;
};

@Controller()
export class EmbeddingConsumer {
  private readonly logger = new Logger(EmbeddingConsumer.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    @InjectModel(MoodLogEmbedding.name)
    private moodLogEmbeddingModel: Model<MoodLogEmbedding>,
    @InjectQueue('recommendation-queue')
    private readonly recQueue: Queue,
  ) {}

  @EventPattern('mood.analyzed')
  async handleMoodAnalyzed(@Payload() payload: MoodAnalyzedPayload) {
    this.logger.debug(`Generating embedding for ${payload.moodLogId}`);

    const embedding = await this.embeddingService.generateEmbedding(
      payload.combinedText,
    );
    this.logger.debug(`Input to embedding: "${payload.combinedText}"`);
    this.logger.debug(`Output length: ${embedding?.length}`);

    const result = await this.moodLogEmbeddingModel.create({
      moodLogId: payload.moodLogId,
      userId: payload.userId,
      embedding,
    });
    this.logger.log(`${result}`);
    this.logger.log(`✅ Processed embedding for moodLog ${payload.moodLogId}`);

    // Enqueue recommendation job
    await this.recQueue.add('recommendation.generate', {
      userId: payload.userId,
      embedding,
    });
  }
}
