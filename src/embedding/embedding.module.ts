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
import { EmbeddingService } from './embedding.service';
import { UserEmbeddingService } from './user-embedding.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExperienceEmbedding.name, schema: ExperienceEmbeddingSchema },
      { name: MoodLogEmbedding.name, schema: MoodLogEmbeddingSchema },
    ]),
  ],
  providers: [EmbeddingService, UserEmbeddingService],
  exports: [EmbeddingService, UserEmbeddingService, MongooseModule],
})
export class EmbeddingModule {}
