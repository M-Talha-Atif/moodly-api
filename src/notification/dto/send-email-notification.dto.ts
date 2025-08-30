// src/notification/dto/send-email-notification.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendEmailNotificationDto {
  @ApiProperty({
    description: 'ID of the user who will receive the email notification',
    example: '64f4eac12345b2cde6789f01',
  })
  userId: string;

  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Subject line of the email',
    example: 'Welcome to our platform!',
  })
  subject: string;

  @ApiPropertyOptional({
    description: 'Plain text content of the email',
    example: 'Thank you for joining our service.',
  })
  text?: string;

  @ApiPropertyOptional({
    description: 'HTML content of the email',
    example: '<h1>Welcome!</h1><p>We are glad to have you onboard.</p>',
  })
  html?: string;

  @ApiPropertyOptional({
    description: 'QR code data to be included in the email',
    example:
      'otpauth://totp/MyApp:username?secret=JBSWY3DPEHPK3PXP&issuer=MyApp',
  })
  qrCodeData?: string;
}
