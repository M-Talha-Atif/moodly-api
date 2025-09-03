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
  // Create an application context (not a single microservice)
  const app = await NestFactory.create(WorkerModule, {
    logger: WinstonModule.createLogger({ transports }),
  });

  // Connect MOOD microservice
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: process.env.RMQ_MOOD_QUEUE || 'mood-tasks',
      queueOptions: { durable: true },
      exchange: process.env.RMQ_MOOD_EXCHANGE || 'mood-exchange',
      exchangeType: 'direct',
      prefetchCount: 1,
    },
  });

  // Connect COMMUNITY microservice
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: process.env.RMQ_COMM_QUEUE || 'community-tasks',
      queueOptions: { durable: true },
      exchange: process.env.RMQ_COMM_EXCHANGE || 'community-exchange',
      exchangeType: 'direct',
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();

  // -----------------------------
  // Startup logs
  // -----------------------------
  const logger = new Logger('WorkerBootstrap');
  logger.log('✅ Worker is listening for RabbitMQ tasks...');
  logger.log(`📡 Listening on queues: 
  - ${process.env.RMQ_MOOD_QUEUE || 'mood-tasks'}
  - ${process.env.RMQ_COMM_QUEUE || 'community-tasks'}
`);
}

bootstrap();
