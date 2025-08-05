import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodLog } from './entities/mood-log.entity';
import { MoodLogService } from './mood-log.service';
import { MoodLogController } from './mood-log.controller';
import { EmbeddingModule } from 'src/embedding/embedding.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoodLog]),
    EmbeddingModule,
  ],
  controllers: [MoodLogController],
  providers: [MoodLogService],
  exports: [MoodLogService],
})
export class MoodLogModule { }
