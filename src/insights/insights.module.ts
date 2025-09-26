import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsService } from './services/insights.service';
import { InsightsController } from './controller/insights.controller';
import { MoodLog } from 'src/mood-log/entities/mood-log.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { CommunityMember } from 'src/community/entities/community/community-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoodLog, Booking, CommunityMember])],
  providers: [InsightsService],
  controllers: [InsightsController],
  exports: [InsightsService],
})
export class InsightsModule {}
