import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoodLog } from '../mood-log/entities/mood-log.entity';
import { EmotionAnalysisService } from '../mood-log/services/emotion-analysis.service';
import { RMQ_DOMAINS } from 'src/config/rmq.constants';
import { UserMoodEmbeddingService } from 'src/embedding/services/user-mood-embedding.service';

type MoodDetectPayload = {
  moodLogId: string;
  userId: string;
  photoPath?: string;
  voicePath?: string;
  moodLabel?: string;
  note?: string;
};

@Controller()
export class MoodDetectionWorker {
  private readonly logger = new Logger(MoodDetectionWorker.name);

  constructor(
    @InjectRepository(MoodLog) private repo: Repository<MoodLog>,
    private readonly emotion: EmotionAnalysisService,
    private readonly userMoodEmbeddingService: UserMoodEmbeddingService, // 👈 inject
    @Inject(RMQ_DOMAINS.MOOD.CLIENT) private readonly rmqClient: ClientProxy,
  ) {}

  @EventPattern(RMQ_DOMAINS.MOOD.ROUTING.DETECT)
  async handleMoodDetect(@Payload() payload: MoodDetectPayload) {
    this.logger.debug(`Processing mood.detect for ${payload.moodLogId}`);

    let photoEmotion: string | undefined;
    let voiceSentiment: string | undefined;

    if (payload.photoPath) {
      const res = await this.emotion.analyzeImageEmotion(payload.photoPath);
      if (res.success && res.data?.dominant_emotion) {
        photoEmotion = res.data.dominant_emotion;
      }
    }

    if (payload.voicePath) {
      const res = await this.emotion.analyzeVoiceEmotion(payload.voicePath);
      if (res.success && res.data?.dominant_emotion) {
        voiceSentiment = res.data.dominant_emotion;
      }
    }

    // compute finalMood
    const finalMood =
      photoEmotion ?? voiceSentiment ?? payload.moodLabel ?? 'neutral';

    // Update DB with all
    await this.repo.update(
      { id: payload.moodLogId },
      { photoEmotion, voiceSentiment, finalMood },
    );

    // 👇 Enriched embedding text
    const enrichedText =
      await this.userMoodEmbeddingService.buildUserEmbeddingText(
        payload.userId,
        finalMood,
        payload.note,
      );

    // Emit follow-up event
    this.rmqClient.emit(RMQ_DOMAINS.MOOD.ROUTING.ANALYZED, {
      moodLogId: payload.moodLogId,
      userId: payload.userId,
      combinedText: enrichedText,
    });
  }
}
