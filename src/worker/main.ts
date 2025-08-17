// src/worker/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: process.env.RABBITMQ_QUEUE || 'mood-tasks',
      queueOptions: { durable: true },
      prefetchCount: 1, // one job at a time per worker instance
      noAck: false,     // we’ll ack/nack manually
    },
  });
  await app.listen();
}
bootstrap();
