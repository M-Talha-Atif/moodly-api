// src/notification/dto/send-email-notification.dto.ts
export class SendEmailNotificationDto {
  userId: string;
  email: string;
  subject: string;
  text?: string;
  html?: string;
  qrCodeData?: string;
}
