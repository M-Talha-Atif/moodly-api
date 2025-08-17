import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmotionModule } from './emotion/emotion.module';
import { ExperienceModule } from './experience/experience.module';
import { MoodLogModule } from './mood-log/mood-log.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { BookingModule } from './booking/booking.module';
import { RedisModule } from './redis/redis.module';
import { BullModule } from '@nestjs/bull';
import { MoodLogQueueModule } from './mood-log/queues/mood-log-queue.module';
import { BullBoardModule } from './bull-board/bull-board.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { DiagramModule } from './diagram/diagram.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/notification.module';
import { AttendanceModule } from './attendance/attendance.module';
import { RmqModule } from 'src/rmq/rmq.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    ScheduleModule.forRoot(),
    AuthModule,
    EmotionModule,
    ExperienceModule,
    MoodLogModule,
    EmbeddingModule,
    BookingModule,
    RedisModule,
    MoodLogQueueModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullBoardModule,
    RmqModule,
    RecommendationModule,
    DiagramModule,
    FeedbackModule,
    NotificationModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
