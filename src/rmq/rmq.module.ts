// src/rmq/rmq.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RMQ_CLIENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],

            // Exchange config
            exchange: process.env.RABBITMQ_EXCHANGE || 'mood-exchange',
            exchangeType: 'direct', // direct | topic | fanout | headers
            routingKey: process.env.RABBITMQ_ROUTING_KEY || 'mood.detect',

            // Queue config
            queue: process.env.RABBITMQ_QUEUE || 'mood-tasks',
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RmqModule {}
