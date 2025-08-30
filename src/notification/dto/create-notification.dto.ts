// src/notification/dto/create-notification.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    example: '12345',
    description: 'ID of the user who will receive the notification',
  })
  userId: string;

  @ApiProperty({
    example: 'Event Reminder',
    description: 'Title of the notification',
  })
  title: string;

  @ApiPropertyOptional({
    example: 'Don’t forget about your meeting tomorrow at 10 AM.',
    description: 'Detailed message for the notification',
  })
  message?: string;

  @ApiPropertyOptional({
    example: 'reminder',
    description:
      'Type/category of the notification (e.g., reminder, alert, system)',
  })
  type?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email address for sending notification (optional)',
  })
  email?: string;
}
