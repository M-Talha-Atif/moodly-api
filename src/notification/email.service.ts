// src/notification/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    const smtpHost = process.env.SMTP_HOST ?? '';
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER ?? '';
    const smtpPass = process.env.SMTP_PASS ?? '';

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      const fromAddress = process.env.SMTP_FROM ?? 'no-reply@example.com';

      await this.transporter.sendMail({
        from: `"AI moodler" <${fromAddress}>`,
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Email sent to ${to} with subject "${subject}"`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to send email: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Failed to send email: Unknown error type');
      }
    }
  }
}
