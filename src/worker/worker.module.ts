import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module'; // <-- import your shared DB module
import { WorkerConsumer } from './worker.consumer';
import { EmbeddingConsumer } from './embedding.consumer';
import { EmotionAnalysisService } from '../mood-log/services/emotion-analysis.service';
import { ValidationService } from '../mood-log/services/validation.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmbeddingService } from '../embedding/embedding.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MoodLogEmbedding,
  MoodLogEmbeddingSchema,
} from '../embedding/schemas/moodlog-embedding.schema';
import { BullModule } from '@nestjs/bull';
import { MoodLog } from '../mood-log/entities/mood-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Reuse central DB module
    DatabaseModule,

    // If worker needs access to certain entities
    TypeOrmModule.forFeature([MoodLog]),

    // Mongo feature models
    MongooseModule.forFeature([
      { name: MoodLogEmbedding.name, schema: MoodLogEmbeddingSchema },
    ]),

    // Bull queues
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    BullModule.registerQueue(
      { name: 'mood-queue' },
      { name: 'recommendation-queue' },
    ),

    // RabbitMQ client
    ClientsModule.registerAsync([
      {
        name: 'RMQ_CLIENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL!],
            queue: process.env.RABBITMQ_QUEUE || 'mood-tasks',
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],

  controllers: [WorkerConsumer, EmbeddingConsumer],
  providers: [EmotionAnalysisService, ValidationService, EmbeddingService],
})
export class WorkerModule {}
