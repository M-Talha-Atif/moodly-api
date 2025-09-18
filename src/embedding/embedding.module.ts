// src/embedding/embedding.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExperienceEmbedding,
  ExperienceEmbeddingSchema,
} from './schemas/experience-embedding.schema';
import {
  MoodLogEmbedding,
  MoodLogEmbeddingSchema,
} from './schemas/moodlog-embedding.schema';
import { EmbeddingService } from './services/embedding.service';
import { UserEmbeddingService } from './services/user-embedding.service';
import { CommonModule } from '../common/common.module';
import { UserMoodEmbeddingService } from './services/user-mood-embedding.service';
import { OnboardingModule } from 'src/onboarding/onboarding.module';
import { InsightsModule } from 'src/insights/insights.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExperienceEmbedding.name, schema: ExperienceEmbeddingSchema },
      { name: MoodLogEmbedding.name, schema: MoodLogEmbeddingSchema },
    ]),
    CommonModule,
    OnboardingModule,
    InsightsModule,
  ],
  providers: [EmbeddingService, UserEmbeddingService, UserMoodEmbeddingService],
  exports: [
    EmbeddingService,
    UserEmbeddingService,
    UserMoodEmbeddingService,
    MongooseModule,
  ],
})
export class EmbeddingModule {}
