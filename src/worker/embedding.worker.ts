import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, ClientProxy } from '@nestjs/microservices';
import { EmbeddingService } from '../embedding/services/embedding.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoodLogEmbedding } from '../embedding/schemas/moodlog-embedding.schema';
import { CommunityEmbedding } from '../embedding/schemas/community-embedding.schema';
import { RMQ_DOMAINS } from 'src/infra/config/rmq.constants';

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
export class EmbeddingWorker {
  private readonly logger = new Logger(EmbeddingWorker.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    @InjectModel(MoodLogEmbedding.name)
    private moodLogEmbeddingModel: Model<MoodLogEmbedding>,
    @Inject(RMQ_DOMAINS.RECOMMENDATION.CLIENT)
    private readonly rmqClient: ClientProxy,
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

    this.logger.log(`Processed embedding for moodLog ${payload.moodLogId}`);

    this.rmqClient.emit(RMQ_DOMAINS.RECOMMENDATION.ROUTING.GENERATE, {
      userId: payload.userId,
      embedding,
      context: payload.combinedText,
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
