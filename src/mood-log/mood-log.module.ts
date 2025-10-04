// mood-log.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { MoodLog } from './entities/mood-log.entity';
import { MoodLogService } from './services/mood-log.service';
import { EmotionAnalysisService } from './services/emotion-analysis.service';
import { StorageService } from './services/storage.service';
import { MoodLogController } from './mood-log.controller';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import {
  MoodLogEmbedding,
  MoodLogEmbeddingSchema,
} from 'src/embedding/schemas/moodlog-embedding.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ValidationService } from './services/validation.service';
import { RmqModule } from 'src/rmq/rmq.module'; //  Import RMQ module
import { RMQ_DOMAINS } from 'src/config/rmq.constants';
import { CommonModule } from 'src/common/common.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([MoodLog]),
    MongooseModule.forFeature([
      { name: MoodLogEmbedding.name, schema: MoodLogEmbeddingSchema },
    ]),
    EmbeddingModule,
    CommonModule,
    RmqModule.register({
      clientName: RMQ_DOMAINS.MOOD.CLIENT,
      exchange: RMQ_DOMAINS.MOOD.EXCHANGE,
      queue: RMQ_DOMAINS.MOOD.QUEUE,
    }),

    MulterModule.register({
      dest: './uploads/temp', // Temporary directory
      limits: {
        fileSize: 30 * 1024 * 1024, // 30 MB
      },
      fileFilter: (req, file, cb) => {
        console.log('📁 MULTER - Processing file:', {
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
        });

        // Allow both images and audio
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('audio/')
        ) {
          cb(null, true);
        } else {
          console.log('❌ MULTER - Unsupported file type:', file.mimetype);
          cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
        }
      },
    }),
  ],
  controllers: [MoodLogController],
  providers: [
    MoodLogService,
    EmotionAnalysisService,
    StorageService,
    ValidationService,
  ],
  exports: [MoodLogService],
})
export class MoodLogModule {}
