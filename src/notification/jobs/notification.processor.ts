// src/notification/jobs/notification.processor.ts
import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { EmailService } from '../email.service';
import { NotificationService } from '../notification.service';

@Processor('notification-queue')
export class NotificationProcessor {
  constructor(
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
  ) {}

  @Process('send')
  async handleNotification(job: Job) {
    const { type, data } = job.data;

    if (type === 'email') {
      const { email, subject, text, html, qrCodeData } = data;
      if (!email) {
        console.warn('No recipient email, skipping email send.');
        return;
      }

      console.log(`Sending email to ${email}...`);
      await this.emailService.sendMail(email, subject, text, html, qrCodeData);
    }

    if (type === 'push') {
      console.log(`Sending push notification to user ${data.userId}...`);
      // Push sending logic here
    }
  }
}
