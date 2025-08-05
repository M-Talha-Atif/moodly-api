import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { Experience } from './entities/experience.entity';
import { UsersModule } from 'src/users/users.module';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { MoodLogModule } from 'src/mood-log/mood-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Experience]), UsersModule, EmbeddingModule, MoodLogModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
