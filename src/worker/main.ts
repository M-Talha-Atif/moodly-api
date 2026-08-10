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
import LokiTransport from 'winston-loki';
import { WORKER_HTTP_PORT, WORKER_PREFETCH_COUNT } from './worker.constants';

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

  // Ships structured logs to Grafana Cloud Loki when configured; skipped entirely
  // otherwise (local dev, or before Grafana credentials are set) rather than erroring.
  if (process.env.LOKI_URL) {
    transports.push(
      new LokiTransport({
        host: process.env.LOKI_URL,
        basicAuth:
          process.env.LOKI_USER && process.env.LOKI_API_KEY
            ? `${process.env.LOKI_USER}:${process.env.LOKI_API_KEY}`
            : undefined,
        labels: {
          app: process.env.OTEL_SERVICE_NAME || 'moodly-worker',
          env: process.env.NODE_ENV || 'development',
        },
        json: true,
        format: winston.format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error('Loki connection error', err),
      }),
    );
  }

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
      prefetchCount: WORKER_PREFETCH_COUNT,
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
      prefetchCount: WORKER_PREFETCH_COUNT,
    },
  });

  // Recommendation Tasks
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: process.env.RMQ_REC_QUEUE || 'recommendation-tasks',
      queueOptions: { durable: true },
      exchange: process.env.RMQ_REC_EXCHANGE || 'recommendation-exchange',
      exchangeType: 'direct',
      prefetchCount: WORKER_PREFETCH_COUNT,
    },
  });
  // Onboarding
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: process.env.RMQ_ONBOARDING_QUEUE || 'onboarding-tasks',
      queueOptions: { durable: true },
      exchange: process.env.RMQ_ONBOARDING_EXCHANGE || 'onboarding-exchange',
      exchangeType: 'direct',
      prefetchCount: WORKER_PREFETCH_COUNT,
    },
  });
  // Experience
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: process.env.RMQ_EXPERIENCE_QUEUE || 'experience-tasks',
      queueOptions: { durable: true },
      // Reads RMQ_ONBOARDING_EXCHANGE, not an experience-specific var, likely a copy-paste
      // slip from the block above. Harmless while both fall back to their own distinct
      // defaults, but would misroute if RMQ_ONBOARDING_EXCHANGE is ever overridden in .env.
      exchange: process.env.RMQ_ONBOARDING_EXCHANGE || 'experience-exchange',
      exchangeType: 'direct',
      prefetchCount: WORKER_PREFETCH_COUNT,
    },
  });

  await app.startAllMicroservices();

  // -----------------------------
  // Startup logs
  // -----------------------------
  const logger = new Logger('WorkerBootstrap');
  logger.log('Worker is listening for RabbitMQ tasks...');
  logger.log(`Listening on queues: 
  - ${process.env.RMQ_MOOD_QUEUE || 'mood-tasks'}
  - ${process.env.RMQ_COMM_QUEUE || 'community-tasks'}
  - ${process.env.RMQ_RECOMMENDATION_QUEUE || 'recommendation-tasks'}
   - ${process.env.RMQ_EXPERIENCE_QUEUE || 'experience-tasks'}
`);

  await app.listen(WORKER_HTTP_PORT);
}

bootstrap();
