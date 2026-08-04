import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'mood-queue' },
      // Add other queues here
    ),
  ],
  exports: [BullModule],
})
export class BullBoardModule {}
