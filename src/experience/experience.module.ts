import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { ExperienceService } from './experience.service';
import { ExperienceRecommendationService } from './experience-recommendation.service';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExperienceEmbedding,
  ExperienceEmbeddingSchema,
} from 'src/embedding/schemas/experience-embedding.schema';
import { ExperienceController } from './experience.controller';
import { UsersModule } from 'src/users/users.module';
import { ExperienceGateway } from './experience.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Experience]),
    EmbeddingModule,
    MongooseModule.forFeature([
      { name: ExperienceEmbedding.name, schema: ExperienceEmbeddingSchema },
    ]),
    UsersModule,
  ],
  controllers: [ExperienceController],
  providers: [
    ExperienceService,
    ExperienceRecommendationService,
    ExperienceGateway,
  ],
  exports: [
    ExperienceService,
    ExperienceRecommendationService,
    ExperienceGateway,
  ],
})
export class ExperienceModule {}
