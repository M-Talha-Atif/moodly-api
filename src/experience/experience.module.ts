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

@Module({
  imports: [
    TypeOrmModule.forFeature([Experience]),
    EmbeddingModule,
    MongooseModule.forFeature([
      { name: ExperienceEmbedding.name, schema: ExperienceEmbeddingSchema },
    ]),
  ],
  providers: [ExperienceService, ExperienceRecommendationService],
  exports: [ExperienceService, ExperienceRecommendationService],
})
export class ExperienceModule {}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ExperienceController } from './experience.controller';
// import { ExperienceService } from './experience.service';
// import { Experience } from './entities/experience.entity';
// import { UsersModule } from 'src/users/users.module';
// import { EmbeddingModule } from 'src/embedding/embedding.module';
// import { MoodLogModule } from 'src/mood-log/mood-log.module';
// import { RecommendationModule } from 'src/recommendation/recommendation.module';
// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Experience]),
//     UsersModule,
//     EmbeddingModule,
//     MoodLogModule,
//     RecommendationModule, // Importing to use in the controller
//   ],
//   controllers: [ExperienceController],
//   providers: [ExperienceService],
//   exports: [ExperienceService], // Exporting so it can be used in other modules
// })
// export class ExperienceModule {}
