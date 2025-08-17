// src/worker/worker.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodLog } from '../mood-log/entities/mood-log.entity';
import { WorkerConsumer } from './worker.consumer';
import { EmotionAnalysisService } from '../mood-log/services/emotion-analysis.service';
import { ValidationService } from '../mood-log/services/validation.service';

// import your TypeORM root connection module here (or use forRootAsync)
@Module({
  imports: [
    TypeOrmModule.forFeature([MoodLog]),
    // ... your TypeORM root config module
  ],
  providers: [WorkerConsumer, EmotionAnalysisService, ValidationService],
})
export class WorkerModule {}
