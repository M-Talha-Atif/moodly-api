import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { Experience } from './entities/experience.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Experience]), UsersModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
