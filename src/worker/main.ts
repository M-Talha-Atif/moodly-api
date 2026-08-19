// src/worker/main.ts
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WORKER_HTTP_PORT, WORKER_PREFETCH_COUNT } from './worker.constants';
import { buildWinstonOptions } from '../logger/winston.config';

async function bootstrap() {
  // -----------------------------
  // Create Worker Microservice. buildWinstonOptions (src/logger/winston.config.ts) is the
  // single source of transport config (console, rotating files, Loki when configured),
  // same one src/main.ts uses, just with 'worker' as the service name/log label instead.
  // -----------------------------
  const app = await NestFactory.create(WorkerModule, {
    logger: WinstonModule.createLogger(buildWinstonOptions('worker')),
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
      exchange: process.env.RMQ_EXP_EXCHANGE || 'experience-exchange',
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
