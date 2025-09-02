// src/worker/main.ts
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';
import * as path from 'path';

/**
 * --------------------------------
 * Safe stringify helper
 * --------------------------------
 */
function safeToString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

async function bootstrap() {
  // -----------------------------
  // Setup Winston Transports
  // -----------------------------
  const logDir = path.join(__dirname, '..', '..', 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const timestamp = safeToString(info.timestamp, '');
          const level = safeToString(info.level, 'info');
          const context = info.context
            ? safeToString(info.context, 'Worker')
            : 'Worker';
          const message = safeToString(info.message, '');
          return `${timestamp} [${context}] ${level}: ${message}`;
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'worker-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ];

  // -----------------------------
  // Create Worker Microservice
  // -----------------------------
  const app = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: process.env.RABBITMQ_QUEUE || 'mood-tasks',
      queueOptions: { durable: true },
      prefetchCount: 1,
    },
    logger: WinstonModule.createLogger({ transports }),
  });

  await app.listen();

  // -----------------------------
  // Startup logs
  // -----------------------------
  const logger = new Logger('WorkerBootstrap');
  logger.log('✅ Worker is listening for RabbitMQ tasks...');
  logger.log(
    `📡 Connected to queue: ${process.env.RABBITMQ_QUEUE || 'mood-tasks'}`,
  );
}

bootstrap();
