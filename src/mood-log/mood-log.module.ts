import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodLog } from './entities/mood-log.entity';
import { MoodLogService } from './mood-log.service';
import { MoodLogController } from './mood-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MoodLog])],
  controllers: [MoodLogController],
  providers: [MoodLogService],
})
export class MoodLogModule {}
