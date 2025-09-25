// src/booking/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './services/user/booking.service';
// import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Experience } from '../experience/entities/experience.entity';
import { NotificationModule } from '../notification/notification.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { ExperienceModule } from '../experience/experience.module'; // 👈 import
// Domain services
import { BookingCreationService } from './services/user/booking-creation.service';
import { BookingCancellationService } from './services/user/booking-cancellation.service';
import { BookingQueryService } from './services/user/booking-query.service';
// Support services
import { BookingValidationService } from './services/user/booking-validation.service';
import { BookingSideEffectsService } from './services/user/booking-side-effects.service';
import { BookingMapperService } from './services/user/booking-mapper.service';
import { BookingFilterService } from './services/user/booking-filter.service';
import { BookingErrorHandler } from './services/user/booking-error-handler.service';
// Common services
import { TransactionService } from 'src/common/services/transaction.service';
// infra
import { RmqModule } from 'src/rmq/rmq.module';
import { BookingStatsService } from './services/user/booking.stats.service';
import { HostBookingQueryService } from './services/host/host-booking-query.service';
import { HostBookingStatsService } from './services/host/host-booking-stats.service';
// Controllers
import { HostBookingController } from './controller/host-booking.controller';
import { UserBookingController } from './controller/user-booking.controller';
import { Feedback } from 'src/feedback/entities/feedback.entity';
// import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Experience, Feedback]),
    NotificationModule,
    AttendanceModule,
    ExperienceModule,
    RmqModule,
  ],
  controllers: [HostBookingController, UserBookingController],
  providers: [
    BookingService,
    // Domain services
    BookingCreationService,
    BookingCancellationService,
    BookingQueryService,
    // Support services
    BookingValidationService,
    BookingSideEffectsService,
    BookingMapperService,
    BookingFilterService,
    BookingErrorHandler,
    // Common services
    TransactionService,
    // Stats services
    BookingStatsService,
    // Host Service
    HostBookingQueryService,
    HostBookingStatsService,
  ],
  exports: [BookingService, BookingStatsService],
})
export class BookingModule {}
