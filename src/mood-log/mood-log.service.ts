import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodLog } from './entities/mood-log.entity';
import { Repository, Between } from 'typeorm';
import { CreateMoodLogDto } from './dto/create-mood-log.dto';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class MoodLogService {
  constructor(
    @InjectRepository(MoodLog)
    private moodLogRepo: Repository<MoodLog>,
  ) { }

  async createForUser(userId: string, dto: CreateMoodLogDto) {
    const mood = this.moodLogRepo.create({
      userId,
      moodLabel: dto.moodLabel,
      note: dto.note,
      textSentiment: dto.textSentiment,
      photoEmotion: dto.photoEmotion,
      voiceTranscript: dto.voiceTranscript,
      voiceSentiment: dto.voiceSentiment,
      sameAsYesterday: dto.sameAsYesterday,
    });

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
