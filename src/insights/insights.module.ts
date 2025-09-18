import { Module } from '@nestjs/common';
import { InsightsService } from './services/insights.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodLog } from 'src/mood-log/entities/mood-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoodLog])],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {}
