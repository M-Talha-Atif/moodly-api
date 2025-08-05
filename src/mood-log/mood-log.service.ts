import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodLog } from './entities/mood-log.entity';
import { Repository, Between } from 'typeorm';
import { CreateMoodLogDto } from './dto/create-mood-log.dto';
import { startOfDay, endOfDay } from 'date-fns';
import { EmbeddingService } from 'src/embedding/embedding.service';

@Injectable()
export class MoodLogService {
  constructor(
    @InjectRepository(MoodLog)
    private moodLogRepo: Repository<MoodLog>,
    private readonly embeddingService: EmbeddingService,
  ) { }

  async createForUser(userId: string, dto: CreateMoodLogDto) {
    const mood = this.moodLogRepo.create({
      userId,
      ...dto,
    });

    const combinedText = `${dto.moodLabel} ${dto.note} ${dto.textSentiment} ${dto.photoEmotion} ${dto.voiceSentiment}`;
    mood.embedding = await this.embeddingService.generateEmbedding(combinedText);

    return this.moodLogRepo.save(mood);
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
}
