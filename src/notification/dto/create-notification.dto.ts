// src/notification/dto/create-notification.dto.ts
export class CreateNotificationDto {
  userId: string;
  title: string;
  message?: string;
  email?: string;
}
