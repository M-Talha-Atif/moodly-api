// src/infra/rmq/rmq.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({})
export class RmqModule {
  /**
   * Register a named RabbitMQ client bound to a specific exchange + queue.
   * Routing keys are specified when emitting (ClientProxy.emit(pattern, data)).
   */
  static register(params: {
    clientName: string;
    exchange: string;
    queue: string;
    exchangeType?: 'direct' | 'topic' | 'fanout' | 'headers';
    url?: string;
  }): DynamicModule {
    const {
      clientName,
      exchange,
      queue,
      exchangeType = 'direct',
      url = process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    } = params;

    return {
      module: RmqModule,
      imports: [
        ClientsModule.register([
          {
            name: clientName,
            transport: Transport.RMQ,
            options: {
              urls: [url],
              exchange,
              exchangeType,
              queue,
              queueOptions: { durable: true },
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
