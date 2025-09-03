import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmbeddingService } from '../embedding/embedding.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoodLogEmbedding } from '../embedding/schemas/moodlog-embedding.schema';
import { CommunityEmbedding } from '../embedding/schemas/community-embedding.schema';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { RMQ_DOMAINS } from 'src/config/rmq.constants';

type MoodAnalyzedPayload = {
  moodLogId: string;
  userId: string;
  combinedText: string;
};
type CommunityEmbeddingPayload = {
  communityId: string;
  name: string;
  description?: string;
  category: string;
  tags?: string[];
  rules?: string;
  location?: string;
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
    @InjectModel(CommunityEmbedding.name)
    private readonly communityEmbeddingModel: Model<CommunityEmbedding>,
  ) {}

  @EventPattern(RMQ_DOMAINS.MOOD.ROUTING.ANALYZED)
  async handleMoodAnalyzed(@Payload() payload: MoodAnalyzedPayload) {
    this.logger.debug(`Generating embedding for ${payload.moodLogId}`);

    const embedding = await this.embeddingService.generateEmbedding(
      payload.combinedText,
    );
    this.logger.debug(`Input to embedding: "${payload.combinedText}"`);
    this.logger.debug(`Output length: ${embedding?.length}`);

    await this.moodLogEmbeddingModel.create({
      moodLogId: payload.moodLogId,
      userId: payload.userId,
      embedding,
    });

    this.logger.log(`✅ Processed embedding for moodLog ${payload.moodLogId}`);

    // Enqueue recommendation job
    await this.recQueue.add('recommendation.generate', {
      userId: payload.userId,
      embedding,
    });
  }

  @EventPattern(RMQ_DOMAINS.COMMUNITY.ROUTING.EMBED)
  async handleCommunityEmbedding(
    @Payload() payload: CommunityEmbeddingPayload,
  ) {
    this.logger.debug(
      `Generating embedding for community ${payload.communityId}`,
    );

    const text = `
      ${payload.name}
      ${payload.description ?? ''}
      ${payload.category}
      ${(payload.tags ?? []).join(', ')}
      ${payload.rules ?? ''}
      ${payload.location ?? ''}
    `.trim();

    const vector = await this.embeddingService.generateEmbedding(text);

    await this.communityEmbeddingModel.findOneAndUpdate(
      { communityId: payload.communityId },
      { embedding: vector },
      { upsert: true },
    );
  }
}
