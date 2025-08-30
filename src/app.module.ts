import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core application modules
import { DatabaseModule } from './database/database.module'; // Database connection & ORM configuration
import { UsersModule } from './users/users.module'; // User management (CRUD, profiles, etc.)
import { AuthModule } from './auth/auth.module'; // authentication & authorization logic
import { RmqModule } from 'src/rmq/rmq.module'; // RabbitMQ integration for microservices messaging

// Feature-specific modules
import { OnboardingModule } from './onboarding/onboarding.module'; // Emotion recognition/processing logic
import { ExperienceModule } from './experience/experience.module'; // User experiences tracking
import { MoodLogModule } from './mood-log/mood-log.module'; // Mood logging and history
import { EmbeddingModule } from './embedding/embedding.module'; // Vector embeddings (AI/ML features)
import { BookingModule } from './booking/booking.module'; // Booking system (sessions, appointments)
import { RecommendationModule } from './recommendation/recommendation.module'; // AI-driven recommendations
import { DiagramModule } from './diagram/diagram.module'; // Visual diagrams/charts for insights
import { FeedbackModule } from './feedback/feedback.module'; // User feedback collection & processing
import { NotificationModule } from './notification/notification.module'; // Push/email/in-app notifications
import { AttendanceModule } from './attendance/attendance.module'; // Attendance tracking & management

// Infrastructure & background job handling
import { RedisModule } from './redis/redis.module'; // Redis cache & session storage
import { BullModule } from '@nestjs/bull'; // Queue system (using Redis + Bull)
import { MoodLogQueueModule } from './mood-log/queues/mood-log-queue.module'; // Queues for mood log tasks
import { BullBoardModule } from './bull-board/bull-board.module'; // Bull Board UI for job monitoring
import { ScheduleModule } from '@nestjs/schedule'; // Cron jobs & scheduled tasks

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Database and user management
    DatabaseModule,
    UsersModule,

    // Scheduler for cron jobs & periodic tasks
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({ isGlobal: true }), // loads .env at app startup

    // Authentication & authorization
    AuthModule,

    // Core domain-specific modules
    OnboardingModule,
    ExperienceModule,
    MoodLogModule,
    EmbeddingModule,
    BookingModule,

    // Infrastructure modules
    RedisModule,
    RmqModule,

    // Background job processing with Redis & Bull
    MoodLogQueueModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost', // Redis host (consider moving to ENV vars for production)
        port: 6379, // Redis port
      },
    }),
    BullBoardModule,

    // AI/Insights/Recommendations
    RecommendationModule,
    DiagramModule,
    FeedbackModule,

    // Notifications & Attendance
    NotificationModule,
    AttendanceModule,
  ],
  controllers: [AppController], // Root controller (handles incoming requests)
  providers: [AppService], // Root service (shared app-level logic)
})
export class AppModule {}
