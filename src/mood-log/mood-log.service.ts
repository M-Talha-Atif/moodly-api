import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodLog } from './entities/mood-log.entity';
import { Repository, Between } from 'typeorm';
import { CreateMoodLogDto } from './dto/create-mood-log.dto';
import { startOfDay, endOfDay } from 'date-fns';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoodLogEmbedding } from 'src/embedding/schemas/moodlog-embedding.schema';

@Injectable()
export class MoodLogService {
  constructor(
    @InjectRepository(MoodLog)
    private moodLogRepo: Repository<MoodLog>,
    private readonly embeddingService: EmbeddingService,
    @InjectModel(MoodLogEmbedding.name)
    private moodLogEmbeddingModel: Model<MoodLogEmbedding>,
  ) { }

  async createForUser(userId: string, dto: CreateMoodLogDto) {
    const mood = this.moodLogRepo.create({ userId, ...dto });
    const saved = await this.moodLogRepo.save(mood);

    const combinedText = `${dto.moodLabel} ${dto.note} ${dto.textSentiment} ${dto.photoEmotion} ${dto.voiceSentiment}`;
    const embedding =
      await this.embeddingService.generateEmbedding(combinedText);

    await this.moodLogEmbeddingModel.create({
      moodLogId: saved.id,
      userId, // <-- Add this
      embedding,
    });

    return saved;
  }

  async getTodayLogForUser(userId: string) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    return this.moodLogRepo.findOne({
      where: {
        userId,
        createdAt: Between(todayStart, todayEnd),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getLatestUserEmbedding(userId: string): Promise<number[] | null> {
    console.log(`Fetching latest embedding for user: ${userId}`);
    const latestLog = await this.moodLogEmbeddingModel
      .findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return latestLog?.embedding || null;
  }

}
