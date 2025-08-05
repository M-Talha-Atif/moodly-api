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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExperienceEmbedding.name, schema: ExperienceEmbeddingSchema },
      { name: MoodLogEmbedding.name, schema: MoodLogEmbeddingSchema },
    ]),
  ],
  providers: [EmbeddingService],
  exports: [EmbeddingService, MongooseModule], // <-- Export models too
})
export class EmbeddingModule {}
