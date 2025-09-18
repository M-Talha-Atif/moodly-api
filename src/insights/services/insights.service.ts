import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoodLog } from 'src/mood-log/entities/mood-log.entity';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(MoodLog)
    private readonly repo: Repository<MoodLog>,
  ) {}

  async getMoodLogStreak(userId: string) {
    const logs = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (logs.length === 0) {
      return { streak: 0, totalDaysLogged: 0 };
    }

    let streak = 1;
    let lastDate = new Date(logs[0].createdAt);

    for (let i = 1; i < logs.length; i++) {
      const currentDate = new Date(logs[i].createdAt);

      // difference in days
      const diffInDays = Math.floor(
        (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffInDays === 1) {
        streak++;
        lastDate = currentDate;
      } else if (diffInDays > 1) {
        break; // streak broken
      }
    }

    return { streak, totalDaysLogged: logs.length };
  }
}
