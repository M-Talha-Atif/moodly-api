import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { User } from '../users/entities/user.entity';
import { Experience } from '../experience/entities/experience.entity';

@Module({
  // Registers entities with TypeORM, making them available within this module's scope.
  // This allows the FeedbackService to use these entities for database operations using their respective repositories like `feedbackRepo` and `experienceRepo`.
  imports: [TypeOrmModule.forFeature([Feedback, Experience, User])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
