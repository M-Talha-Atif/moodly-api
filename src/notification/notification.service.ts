// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notification.gateway';
import { SendEmailNotificationDto } from './dto/send-email-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly gateway: NotificationGateway,
    @InjectQueue('notification-queue')
    private readonly notificationQueue: Queue,
  ) {}

  async createAndSend(dto: CreateNotificationDto) {
    // 1. Save notification in DB
    const notification = this.notificationRepo.create(dto);
    await this.notificationRepo.save(notification);

    // 2. Emit via WebSocket
    this.gateway.sendToUser(dto.userId, notification);

    // 3. Get user email for email notification
    const emailOfUser = dto.email;

    if (emailOfUser) {
      const emailJob: SendEmailNotificationDto = {
        userId: dto.userId,
        email: emailOfUser,
        subject: dto.title,
        text: dto.message ?? '',
        html: `<p>${dto.message ?? ''}</p>`,
      };

      await this.notificationQueue.add('send', {
        type: 'email',
        data: emailJob,
      });
    }

    return notification;
  }
}
