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
      const { email, subject, text, html } = data;
      if (!email) {
        console.warn('No recipient email, skipping email send.');
        return;
      }

      console.log(`Sending email to ${email}...`);
      await this.emailService.sendMail(email, subject, text, html);
    }

    if (type === 'push') {
      console.log(`Sending push notification to user ${data.userId}...`);
      // Push sending logic here
    }
  }

  // new booking_confirmed handler
  @Process('booking_confirmed')
  async handleBookingConfirmed(job: Job) {
    const { bookingId, userId, experienceTitle, email, title, message } =
      job.data;

    try {
      // let the notification service persist + queue email/send push
      await this.notificationService.createAndSend({
        userId,
        email, // may be null, createAndSend should gracefully handle absence
        title,
        message,
      });
    } catch (err) {
      console.error('Failed processing booking_confirmed job', err);
      // the job will retry according to Bull options set by enqueue (attempts/backoff)
      throw err;
    }
  }
}
