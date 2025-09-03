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
import { EmotionAnalysisService } from './emotion-analysis.service';
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
  ) { }

  async createForUser(
    userId: string,
    dto: CreateMoodLogDto,
    files?: { photo?: Express.Multer.File; voice?: Express.Multer.File },
  ) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    try {
      // Check existing log
      const existingLog = await this.moodLogRepo.findOne({
        where: { userId, createdAt: Between(todayStart, todayEnd) },
      });
      if (existingLog) {
        return ResultDto.ok(existingLog, 'Mood log already exists for today');
      }

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

  async getTodayLogForUser(userId: string) {
    try {
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());

      const log = await this.moodLogRepo.findOne({
        where: { userId, createdAt: Between(todayStart, todayEnd) },
        order: { createdAt: 'DESC' },
      });

      if (!log) {
        return ResultDto.fail('No mood log found for today', 404, 'NOT_FOUND');
      }

      return ResultDto.ok(log, "Fetched today's mood log");
    } catch (error) {
      this.logger.error("Error fetching today's mood log:", error);
      throw new InternalServerErrorException('Failed to fetch mood log');
    }
  }

  async getHistoryForUser(userId: string, limit = 30, page = 1) {
    try {
      const [logs, total] = await this.moodLogRepo.findAndCount({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
      });

      return ResultDto.ok(
        {
          data: logs,
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
}
