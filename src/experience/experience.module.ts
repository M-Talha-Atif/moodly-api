import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { ExperienceService } from './services/experience.service';
import { ExperienceRecommendationService } from './experience-recommendation.service';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExperienceEmbedding,
  ExperienceEmbeddingSchema,
} from 'src/embedding/schemas/experience-embedding.schema';
import { UsersModule } from 'src/users/users.module';
import { ExperienceGateway } from './experience.gateway';
import { ExperienceFilterService } from './services/experience-filter.service';
import { S3Service } from '../common/services/s3.service';
import { CommonModule } from '../common/common.module';
import { ExperienceHostController } from './controllers/experience.host.controller';
import { ExperiencePublicController } from './controllers/experience.public.controller';
import { ExperienceUserController } from './controllers/experience.user.controller';
import { ExperienceHostService } from '../experience/services/host/experience-host.service';
import { AiExperienceService } from './services/host/ai-experience.service';
import { RmqModule } from 'src/rmq/rmq.module';
import { RMQ_DOMAINS } from 'src/config/rmq.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Experience]),
    EmbeddingModule,
    MongooseModule.forFeature([
      { name: ExperienceEmbedding.name, schema: ExperienceEmbeddingSchema },
    ]),
    UsersModule,
    CommonModule,
    RmqModule.register({
      clientName: RMQ_DOMAINS.EXPERIENCE.CLIENT,
      exchange: RMQ_DOMAINS.EXPERIENCE.EXCHANGE,
      queue: RMQ_DOMAINS.EXPERIENCE.QUEUE,
    }),

  ],
  controllers: [
    ExperienceHostController,
    ExperiencePublicController,
    ExperienceUserController,
  ],
  providers: [
    ExperienceService,
    ExperienceFilterService,
    ExperienceRecommendationService,
    ExperienceGateway,
    ExperienceHostService,
    S3Service,
    AiExperienceService,
  ],
  exports: [
    ExperienceService,
    ExperienceRecommendationService,
    ExperienceGateway,
  ],
})
export class ExperienceModule { }
