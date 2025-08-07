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

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
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
    RecommendationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
