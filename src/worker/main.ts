// src/worker/main.ts
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: process.env.RABBITMQ_QUEUE || 'mood-tasks',
      queueOptions: { durable: true },
      prefetchCount: 1,
    },
  });

  await app.listen();
  console.log('✅ Worker is listening for RabbitMQ tasks...');
}
bootstrap();
