// src/notification/notification.service.ts
import { Injectable, HttpException } from '@nestjs/common';
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

  // Inside NotificationService
  async sendEmail(emailDto: SendEmailNotificationDto) {
    await this.notificationQueue.add('send', {
      type: 'email',
      data: emailDto,
    });
  }

  async getUserNotifications(
    userId: string,
    filters: { type?: string; read?: boolean },
  ) {
    const qb = this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId });

    if (filters.type) {
      qb.andWhere('notification.type = :type', { type: filters.type });
    }

    if (typeof filters.read === 'boolean') {
      qb.andWhere('notification.read = :read', { read: filters.read });
    }

    qb.orderBy('notification.createdAt', 'DESC');

    const notifications = await qb.getMany();

    // Map entities to frontend-friendly objects
    return notifications.map((n) => this.mapNotification(n));
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id, userId },
    });
    if (!notification) {
      throw new HttpException('Notification not found', 404);
    }
    notification.read = true;
    await this.notificationRepo.save(notification);
    return { id: notification.id, read: true };
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.update({ userId }, { read: true });
    return { userId, read: true };
  }

  private mapNotification(n: Notification) {
    return {
      id: n.id,
      title: n.title,
      message: n.message,
      read: n.read,
      type: n.type ?? 'general',
      createdAt: n.createdAt.toISOString(), // serialize Date to ISO string
    };
  }
}
