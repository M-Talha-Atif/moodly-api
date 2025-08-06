import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
  ) {}

  async createForUser(userId: string, dto: CreateMoodLogDto) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    try {
      const existingLog = await this.moodLogRepo.findOne({
        where: {
          userId,
          createdAt: Between(todayStart, todayEnd),
        },
      });

      if (existingLog) {
        console.log('Mood log already exists. Returning existing log.');
        return existingLog;
      }

      const mood = this.moodLogRepo.create({ userId, ...dto });
      const saved = await this.moodLogRepo.save(mood);

      const combinedText = `${dto.moodLabel} ${dto.note} ${dto.textSentiment} ${dto.photoEmotion} ${dto.voiceSentiment}`;
      const embedding =
        await this.embeddingService.generateEmbedding(combinedText);

      await this.moodLogEmbeddingModel.create({
        moodLogId: saved.id,
        userId,
        embedding,
      });

      return saved;
    } catch (error) {
      console.error('Error creating mood log:', error);
      throw new InternalServerErrorException('Failed to create mood log');
    }
  }

  async getTodayLogForUser(userId: string) {
    try {
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());

      const log = await this.moodLogRepo.findOne({
        where: {
          userId,
          createdAt: Between(todayStart, todayEnd),
        },
        order: { createdAt: 'DESC' },
      });

      if (!log) {
        throw new NotFoundException('No mood log found for today.');
      }

      return log;
    } catch (error) {
      console.error("Error fetching today's mood log:", error);
      throw new InternalServerErrorException('Failed to fetch mood log');
    }
  }

  async getLatestUserEmbedding(userId: string): Promise<number[] | null> {
    try {
      const latestLog = await this.moodLogEmbeddingModel
        .findOne({ userId })
        .sort({ createdAt: -1 })
        .lean();

      return latestLog?.embedding || null;
    } catch (error) {
      console.error('Error fetching latest embedding:', error);
      throw new InternalServerErrorException('Failed to fetch user embedding');
    }
  }
}
