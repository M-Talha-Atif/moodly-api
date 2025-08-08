import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { PendingFeedbackService } from '../pending-feedback.service';

@Processor('feedback-request')
export class FeedbackRequestProcessor {
  constructor(
    private readonly pendingFeedbackService: PendingFeedbackService,
  ) {}

  @Process('create')
  async handle(job: Job<{ userId: string; experienceId: string }>) {
    const { userId, experienceId } = job.data;
    await this.pendingFeedbackService.create(userId, experienceId);
    console.log(
      `📩 Pending feedback entry created for user ${userId}, exp ${experienceId}`,
    );
  }
}
