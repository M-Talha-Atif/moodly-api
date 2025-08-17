// src/worker/worker.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, RmqContext, Ctx } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoodLog } from '../mood-log/entities/mood-log.entity';
import { EmotionAnalysisService } from '../mood-log/services/emotion-analysis.service';

type MoodDetectPayload = {
  moodLogId: string;
  userId: string;
  photoPath?: string;
  voicePath?: string;
  moodLabel?: string;
  note?: string;
};

@Controller()
export class WorkerConsumer {
  private readonly logger = new Logger(WorkerConsumer.name);

  constructor(
    @InjectRepository(MoodLog) private repo: Repository<MoodLog>,
    private readonly emotion: EmotionAnalysisService,
  ) {}

  @EventPattern('mood.detect')
  async handleMoodDetect(payload: MoodDetectPayload, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const msg = ctx.getMessage();

    try {
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

      // Update the mood log with analysis results
      await this.repo.update(
        { id: payload.moodLogId },
        { photoEmotion, voiceSentiment },
      );

      // (Optional) compute embeddings or emit another event for recommendations

      channel.ack(msg); // ✅ success
    } catch (err) {
      this.logger.error(`mood.detect failed: ${err.message}`, err.stack);
      // Decide requeue policy. Simple: requeue once, otherwise dead-letter.
      const requeue = false;
      channel.nack(msg, false, requeue);
    }
  }
}
