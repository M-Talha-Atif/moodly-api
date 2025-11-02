import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodLog } from '../entities/mood-log.entity';
import { Repository, Between } from 'typeorm';
import { CreateMoodLogDto } from '../dto/create-mood-log.dto';
import { startOfDay, endOfDay } from 'date-fns';
import { ValidationService } from './validation.service';
import { ResultDto } from 'src/common/dto/result.dto';
import { StorageService } from './storage.service';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_DOMAINS } from 'src/config/rmq.constants';

@Injectable()
export class MoodLogService {
  private readonly logger = new Logger(MoodLogService.name);

  constructor(
    @InjectRepository(MoodLog)
    private moodLogRepo: Repository<MoodLog>,
    @Inject(RMQ_DOMAINS.MOOD.CLIENT)
    private readonly rmqClient: ClientProxy,
    private readonly validationService: ValidationService,
    private readonly storageService: StorageService,
  ) {}

  async createForUser(
    userId: string,
    dto: CreateMoodLogDto,
    files?: { photo?: Express.Multer.File; voice?: Express.Multer.File },
  ) {
    try {
      console.log(dto);

      console.log('🛠️ SERVICE - Parameters received:', {
        userId,
        dto: {
          moodLabel: dto.moodLabel,
          note: dto.note,
          textSentiment: dto.textSentiment,
        },
        files: {
          hasPhoto: !!files?.photo,
          hasVoice: !!files?.voice,
          photo: files?.photo
            ? {
                originalname: files.photo.originalname,
                mimetype: files.photo.mimetype,
                size: files.photo.size,
              }
            : 'NO PHOTO IN SERVICE',
          voice: files?.voice
            ? {
                originalname: files.voice.originalname,
                mimetype: files.voice.mimetype,
                size: files.voice.size,
              }
            : 'NO VOICE IN SERVICE',
        },
      });

      // Validate inputs
      const inputValidation = this.validationService.validateInputs(dto, files);
      if (!inputValidation.success) return inputValidation;

      // Validate and save files
      if (files?.photo) {
        dto.photoPath = await this.storageService.save(files.photo, 'photo');
      }

      if (files?.voice) {
        // Validate BEFORE saving
        const voiceValidation = this.validationService.validateVoiceFile(
          files.voice,
        );
        if (!voiceValidation.success) return voiceValidation;

        dto.voicePath = await this.storageService.save(files.voice, 'voice');
      }

      // Create and save mood log
      const mood = this.moodLogRepo.create({
        userId,
        ...dto,
        photoEmotion: undefined,
        voiceSentiment: undefined,
        finalMood: dto.moodLabel ?? null,
      });

      const saved = await this.moodLogRepo.save(mood);

      // Queue analysis
      this.rmqClient.emit(RMQ_DOMAINS.MOOD.ROUTING.DETECT, {
        moodLogId: saved.id,
        userId,
        photoPath: dto.photoPath,
        voicePath: dto.voicePath,
        moodLabel: dto.moodLabel,
        note: dto.note,
      });

      return ResultDto.ok(saved, 'Mood log created; analysis queued');
    } catch (error) {
      this.logger.error('Error creating mood log:', error);
      throw new InternalServerErrorException('Failed to create mood log');
    }
  }

  async getTodayLogsForUser(userId: string): Promise<ResultDto<MoodLog[]>> {
    const todayLogs = await this.moodLogRepo
      .createQueryBuilder('moodLog')
      .where('moodLog.userId = :userId', { userId })
      .andWhere('DATE(moodLog.createdAt) = CURRENT_DATE')
      .orderBy('moodLog.createdAt', 'DESC')
      .getMany();

    if (!todayLogs.length) {
      return ResultDto.fail<MoodLog[]>(
        'No mood logs found for today',
        404,
        'MOOD_LOG_NOT_FOUND',
      );
    }

    return ResultDto.ok<MoodLog[]>(
      todayLogs,
      "Today's mood logs retrieved successfully",
    );
  }

  async getRecentMoodLog(userId: string): Promise<ResultDto<MoodLog>> {
    const recentLog = await this.moodLogRepo
      .createQueryBuilder('moodLog')
      .where('moodLog.userId = :userId', { userId })
      .orderBy('moodLog.createdAt', 'DESC')
      .getOne();

    if (!recentLog) {
      return ResultDto.fail<MoodLog>(
        'No mood logs found for user',
        404,
        'MOOD_LOG_NOT_FOUND',
      );
    }

    return ResultDto.ok<MoodLog>(
      recentLog,
      'Most recent mood log retrieved successfully',
    );
  }

  async getHistoryForUser(userId: string, limit = 30, page = 1) {
    try {
      const [logs, total] = await this.moodLogRepo.findAndCount({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
        select: ['id', 'createdAt', 'finalMood'], //
      });

      const mapped = logs.map((log) => ({
        id: log.id,
        createdAt: log.createdAt.toISOString().split('T')[0],
        finalMood: log.finalMood,
      }));

      return ResultDto.ok(
        {
          data: mapped,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        'Fetched mood log history',
      );
    } catch (error) {
      this.logger.error('Error fetching mood log history:', error);
      throw new InternalServerErrorException(
        'Failed to fetch mood log history',
      );
    }
  }

  async getLogsInRange(userId: string, start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const logs = await this.moodLogRepo.find({
      where: {
        userId,
        createdAt: Between(startOfDay(startDate), endOfDay(endDate)),
      },
      order: { createdAt: 'ASC' },
      select: ['id', 'createdAt', 'finalMood'],
    });

    //  Normalize response
    // log.createdAt is a Date object from DB
    // .toISOString()  -> converts it to ISO string like "2025-09-13T11:45:30.000Z"
    // .split('T')[0]  -> splits at 'T' and takes the first part ("2025-09-13")
    // Result: only the date (YYYY-MM-DD) without tim
    const mapped = logs.map((log) => ({
      id: log.id,
      createdAt: log.createdAt.toISOString().split('T')[0],
      finalMood: log.finalMood,
    }));

    return ResultDto.ok(mapped, 'Fetched mood logs for range');
  }

  async countDailyMoodLogs(userId: string) {
    // Use QueryBuilder for distinct dates
    const count = await this.moodLogRepo
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT DATE(log.createdAt))', 'daysCount')
      .where('log.userId = :userId', { userId })
      .getRawOne();

    return count.daysCount; // number of days user logged mood
  }

  async getUserMoodLogDates(userId: string) {
    const logs = await this.moodLogRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
      select: ['createdAt'],
    });

    // Only keep the date part (YYYY-MM-DD)
    return logs.map((log) => log.createdAt.toISOString().split('T')[0]);
  }

  private calculateStreak(dates: string[]) {
    if (!dates.length) return 0;

    let streak = 1;
    let maxStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currentDate = new Date(dates[i]);

      // Check if currentDate is exactly 1 day after prevDate
      const diff =
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        streak++;
        if (streak > maxStreak) maxStreak = streak;
      } else if (diff > 1) {
        streak = 1; // streak broken
      }
    }

    return maxStreak;
  }

  async getMoodLogStreak(userId: string) {
    const dates = await this.getUserMoodLogDates(userId);
    const streak = this.calculateStreak(dates);
    return { streak, totalDaysLogged: dates.length };
  }

  async getHeatmapData(userId: string) {
    const logs = await this.moodLogRepo.find({
      where: { userId },
      select: ['createdAt', 'finalMood'],
      order: { createdAt: 'ASC' },
    });

    const map = Object.fromEntries(
      logs.map((log) => [
        log.createdAt.toISOString().split('T')[0],
        log.finalMood,
      ]),
    );

    return ResultDto.ok(map, 'Mood heatmap data fetched');
  }

  async getDailySummary(userId: string): Promise<ResultDto<any>> {
    const todayLogs = await this.moodLogRepo
      .createQueryBuilder('moodLog')
      .where('moodLog.userId = :userId', { userId })
      .andWhere('DATE(moodLog.createdAt) = CURRENT_DATE')
      .orderBy('moodLog.createdAt', 'ASC')
      .getMany();

    if (!todayLogs.length) {
      return ResultDto.fail('No mood logs found for today', 404);
    }

    const summary = {
      morning: [] as MoodLog[],
      afternoon: [] as MoodLog[],
      night: [] as MoodLog[],
    };

    for (const log of todayLogs) {
      const hour = new Date(log.createdAt).getHours();

      if (hour >= 5 && hour < 12) summary.morning.push(log);
      else if (hour >= 12 && hour < 18) summary.afternoon.push(log);
      else summary.night.push(log);
    }

    // Helper: get most frequent mood in a group
    const getDominantMood = (logs: MoodLog[]) => {
      const freq: Record<string, number> = {};
      for (const log of logs) {
        const mood = log.finalMood || log.moodLabel || 'unknown';
        freq[mood] = (freq[mood] || 0) + 1;
      }
      return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    };

    const result = {
      morning: {
        count: summary.morning.length,
        dominantMood: getDominantMood(summary.morning),
        logs: summary.morning,
      },
      afternoon: {
        count: summary.afternoon.length,
        dominantMood: getDominantMood(summary.afternoon),
        logs: summary.afternoon,
      },
      night: {
        count: summary.night.length,
        dominantMood: getDominantMood(summary.night),
        logs: summary.night,
      },
    };

    return ResultDto.ok(result, "Today's mood summary generated successfully");
  }
}
