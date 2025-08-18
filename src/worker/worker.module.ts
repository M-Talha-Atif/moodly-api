// src/worker/worker.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodLog } from '../mood-log/entities/mood-log.entity';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Postgres (worker)
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [MoodLog],
        synchronize: true, // turn off in prod
      }),
    }),
    TypeOrmModule.forFeature([MoodLog]),

    // Mongo (worker)
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([
      { name: MoodLogEmbedding.name, schema: MoodLogEmbeddingSchema },
    ]),

    // Bull (worker) — REQUIRED so @InjectQueue works here
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    BullModule.registerQueue({
      name: 'recommendation-queue',
    }),

    // RMQ client (optional; used to emit follow-up events)
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
