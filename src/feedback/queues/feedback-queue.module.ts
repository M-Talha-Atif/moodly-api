// src/feedback/queues/feedback-queue.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FeedbackRequestProcessor } from './feedback-request.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingFeedback } from '../entities/pending-feedback.entity';
import { Feedback } from '../entities/feedback.entity'; // ⬅️ add this
import { PendingFeedbackService } from '../pending-feedback.service';
import { ExperienceModule } from '../../experience/experience.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'feedback-request',
    }),
    TypeOrmModule.forFeature([PendingFeedback, Feedback]), // register both repos
    ExperienceModule, // provides ExperienceService
  ],
  providers: [FeedbackRequestProcessor, PendingFeedbackService],
  exports: [BullModule],
})
export class FeedbackQueueModule {}
