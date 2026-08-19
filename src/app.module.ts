// app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestContextMiddleware } from './logger/request-context.middleware';
import { LoggingInterceptor } from './logger/logging.interceptor';

// Core application modules
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RmqModule } from 'src/infra/rmq/rmq.module';
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
import { RedisModule } from './infra/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CommunityModule } from './community/community.module';

//  Winston logger
import { WinstonModule } from 'nest-winston';
import { buildWinstonOptions } from './logger/winston.config';
import { InsightsModule } from './insights/insights.module';
import { ProfileModule } from './users/profile/profile.module';
// import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // Winston logger (register provider globally)
    WinstonModule.forRoot(buildWinstonOptions('api')),

    // Database and user management
    DatabaseModule,
    UsersModule,

    // ThrottlerModule.forRoot([
    //   {
    //     name: 'default',
    //     ttl: 60000, // 60 seconds in milliseconds
    //     limit: 120, // max 60 requests per 60 seconds
    //   },
    //   {
    //     name: 'auth',
    //     ttl: 60000, // 60 seconds
    //     limit: 15, // max 5 requests per 60 seconds
    //   },
    //   {
    //     name: 'login',
    //     ttl: 60000, // 60 seconds
    //     limit: 5, // max 5 requests per 60 seconds
    //   },
    // ]),
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
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Generates/forwards x-request-id and runs the rest of the request inside
    // AsyncLocalStorage (see src/logger/als.ts) so every Winston log line for this
    // request, wherever it's written from, carries the same requestId.
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
