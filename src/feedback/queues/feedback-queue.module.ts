import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FeedbackRequestProcessor } from './feedback-request.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingFeedback } from '../entities/pending-feedback.entity';
import { PendingFeedbackService } from '../pending-feedback.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'feedback-request',
    }),
    TypeOrmModule.forFeature([PendingFeedback]),
  ],
  providers: [FeedbackRequestProcessor, PendingFeedbackService],
  exports: [BullModule],
})
export class FeedbackQueueModule {}
