import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodLog } from '../entities/mood-log.entity';
import { Repository, Between } from 'typeorm';
import { CreateMoodLogDto } from '../dto/create-mood-log.dto';
import { startOfDay, endOfDay } from 'date-fns';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoodLogEmbedding } from 'src/embedding/schemas/moodlog-embedding.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { EmotionAnalysisService } from './emotion-analysis.service';
import { ValidationService } from './validation.service';
import { ResultDto } from 'src/common/dto/result.dto';
import { StorageService } from './storage.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MoodLogService {
  private readonly logger = new Logger(MoodLogService.name);

  constructor(
    @InjectRepository(MoodLog)
    private moodLogRepo: Repository<MoodLog>,
    private readonly embeddingService: EmbeddingService,
    @InjectModel(MoodLogEmbedding.name)
    private moodLogEmbeddingModel: Model<MoodLogEmbedding>,
    @InjectQueue('mood-queue') private moodQueue: Queue,
    @Inject('RMQ_CLIENT') private readonly rmqClient: ClientProxy,
    private readonly emotionAnalysisService: EmotionAnalysisService,
    private readonly validationService: ValidationService,
    private readonly storageService: StorageService,
  ) {}

  async createForUser(
    userId: string,
    dto: CreateMoodLogDto,
    files?: { photo?: Express.Multer.File; voice?: Express.Multer.File },
  ) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    try {
      // Prevent multiple logs in same day
      const existingLog = await this.moodLogRepo.findOne({
        where: { userId, createdAt: Between(todayStart, todayEnd) },
      });
      if (existingLog) {
        return ResultDto.ok(existingLog, 'Mood log already exists for today');
      }

      // Validate inputs
      const inputValidation = this.validationService.validateInputs(dto);
      if (!inputValidation.success) return inputValidation;

      // validate & save files
      if (files?.photo) dto.photoPath = await this.storageService.save(files.photo, 'photo');
      if (files?.voice) {
        dto.voicePath = await this.storageService.save(files.voice, 'voice');
        const val = this.validationService.validateVoiceFile(dto.voicePath);
        if (!val.success) return val;
      }

      // Save mood log immediately (mark analysis pending)
      const mood = this.moodLogRepo.create({
        userId,
        ...dto,
        photoEmotion: null,
        voiceSentiment: null,
      });
      const saved = await this.moodLogRepo.save(mood);

      // 🔥 Offload analysis to RabbitMQ (fire-and-forget)
      this.rmqClient.emit('mood.detect', {
        moodLogId: saved.id,
        userId,
        photoPath: dto.photoPath,
        voicePath: dto.voicePath,
        moodLabel: dto.moodLabel,
        note: dto.note,
      });

      // Optionally also enqueue embedding/reco; or let worker do it after analysis
      return ResultDto.ok(saved, 'Mood log created; analysis queued');

      // // Save mood log
      // const mood = this.moodLogRepo.create({ userId, ...dto });
      // const saved = await this.moodLogRepo.save(mood);

      // // Push embedding task
      // const combinedText = `${dto.moodLabel ?? ''} ${dto.note ?? ''} ${
      //   dto.textSentiment ?? ''
      // } ${dto.photoEmotion ?? ''} ${dto.voiceSentiment ?? ''}`;

      // await this.moodQueue.add('mood.logged', {
      //   moodLogId: saved.id,
      //   userId,
      //   combinedText,
      // });

      // return ResultDto.ok(saved, 'Mood log created successfully');
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
}
