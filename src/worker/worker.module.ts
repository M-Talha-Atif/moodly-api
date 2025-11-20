import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module'; // <-- import your shared DB module
import { MoodDetectionWorker } from './mood-detection.worker';
import { EmbeddingWorker } from './embedding.worker';
import { EmotionAnalysisService } from '../mood-log/services/emotion-analysis.service';
import { ValidationService } from '../mood-log/services/validation.service';
import { ConfigModule } from '@nestjs/config';
import { EmbeddingService } from '../embedding/services/embedding.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MoodLogEmbedding,
  MoodLogEmbeddingSchema,
} from '../embedding/schemas/moodlog-embedding.schema';
import {
  CommunityEmbedding,
  CommunityEmbeddingSchema,
} from '../embedding/schemas/community-embedding.schema';
import { MoodLog } from '../mood-log/entities/mood-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from 'src/rmq/rmq.module';
import { RMQ_DOMAINS } from 'src/config/rmq.constants';
import { CommonModule } from 'src/common/common.module';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { RecommendationWorker } from './recommendation.worker';
import { RecommendationModule } from 'src/recommendation/recommendation.module';
import { User } from 'src/users/entities/user.entity';
import { OnboardingWorker } from './onboarding.worker';
import { UsersModule } from 'src/users/users.module';
import { ExperienceModule } from '../experience/experience.module';

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
      { name: CommunityEmbedding.name, schema: CommunityEmbeddingSchema },
    ]),

    // RabbitMQ client, works for consumer
    RmqModule.register({
      clientName: RMQ_DOMAINS.MOOD.CLIENT,
      exchange: RMQ_DOMAINS.MOOD.EXCHANGE,
      queue: RMQ_DOMAINS.MOOD.QUEUE,
    }),
    RmqModule.register({
      clientName: RMQ_DOMAINS.COMMUNITY.CLIENT,
      exchange: RMQ_DOMAINS.COMMUNITY.EXCHANGE,
      queue: RMQ_DOMAINS.COMMUNITY.QUEUE,
    }),

    RmqModule.register({
      clientName: RMQ_DOMAINS.RECOMMENDATION.CLIENT,
      exchange: RMQ_DOMAINS.RECOMMENDATION.EXCHANGE,
      queue: RMQ_DOMAINS.RECOMMENDATION.QUEUE,
    }),
    RmqModule.register({
      clientName: RMQ_DOMAINS.ONBOARDING.CLIENT,
      exchange: RMQ_DOMAINS.ONBOARDING.EXCHANGE,
      queue: RMQ_DOMAINS.ONBOARDING.QUEUE,
    }),
    RmqModule.register({
      clientName: RMQ_DOMAINS.EXPERIENCE.CLIENT,
      exchange: RMQ_DOMAINS.EXPERIENCE.EXCHANGE,
      queue: RMQ_DOMAINS.EXPERIENCE.QUEUE,
    }),
    TypeOrmModule.forFeature([User]), 

    // Common Module
    CommonModule,

    EmbeddingModule,

    UsersModule,

    RecommendationModule,

    ExperienceModule,
  ],

  controllers: [
    MoodDetectionWorker,
    EmbeddingWorker,
    RecommendationWorker,
    OnboardingWorker,
  ],
  providers: [EmotionAnalysisService, ValidationService, EmbeddingService],
})
export class WorkerModule { }
