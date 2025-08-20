import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { PendingFeedback } from './entities/pending-feedback.entity';
import { User } from '../users/entities/user.entity';
import { Experience } from '../experience/entities/experience.entity';
import { Booking } from '../booking/entities/booking.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { PendingFeedbackService } from './pending-feedback.service';
import { FeedbackQueueModule } from './queues/feedback-queue.module';
import { FeedbackCron } from './jobs/feedback.cron';
import { ExperienceModule } from '../experience/experience.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feedback,
      PendingFeedback,
      Experience,
      User,
      Booking,
    ]),
    FeedbackQueueModule,
    ExperienceModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, PendingFeedbackService, FeedbackCron],
})
export class FeedbackModule {}
