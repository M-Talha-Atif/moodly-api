// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core application modules
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RmqModule } from 'src/rmq/rmq.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ExperienceModule } from './experience/experience.module';
import { MoodLogModule } from './mood-log/mood-log.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { BookingModule } from './booking/booking.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { DiagramModule } from './diagram/diagram.module';
import { FeedbackModule } from './feedback/feedback.module';
import { NotificationModule } from './notification/notification.module';
import { AttendanceModule } from './attendance/attendance.module';
import { RedisModule } from './redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CommunityModule } from './community/community.module';

//  Winston logger
import { WinstonModule } from 'nest-winston';
import { buildWinstonOptions } from './logger/winston.config';
import { InsightsModule } from './insights/insights.module';
import { ProfileModule } from './users/profile/profile.module';

@Module({
  imports: [
    // Winston logger (register provider globally)
    WinstonModule.forRoot(buildWinstonOptions('api')),

    // Database and user management
    DatabaseModule,
    UsersModule,

    // Scheduler for cron jobs
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({ isGlobal: true }),

    // Authentication & domain-specific modules
    AuthModule,
    OnboardingModule,
    ExperienceModule,
    MoodLogModule,
    EmbeddingModule,
    BookingModule,
    ProfileModule,

    // Infrastructure
    RedisModule,
    RmqModule,

    // AI/Insights
    RecommendationModule,
    DiagramModule,
    FeedbackModule,

    // Notifications & Attendance
    NotificationModule,
    AttendanceModule,
    CommunityModule,
    InsightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
