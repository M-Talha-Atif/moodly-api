// src/booking/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './services/booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Experience } from '../experience/entities/experience.entity';
import { NotificationModule } from '../notification/notification.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { ExperienceModule } from '../experience/experience.module'; // 👈 import

// Domain services
import { BookingCreationService } from './services/booking-creation.service';
import { BookingCancellationService } from './services/booking-cancellation.service';
import { BookingQueryService } from './services/booking-query.service';
// Support services
import { BookingValidationService } from './services/booking-validation.service';
import { BookingSideEffectsService } from './services/booking-side-effects.service';
import { BookingMapperService } from './services/booking-mapper.service';
import { BookingFilterService } from './services/booking-filter.service';
import { BookingErrorHandler } from './services/booking-error-handler.service';
// Common services
import { TransactionService } from 'src/common/services/transaction.service';
// infra
import { RmqModule } from 'src/rmq/rmq.module';
import { BookingStatsService } from './services/booking.stats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Experience]),
    NotificationModule,
    AttendanceModule,
    ExperienceModule,
    RmqModule,
  ],
  controllers: [BookingController],
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
  ],
  exports: [BookingService, BookingStatsService],
})
export class BookingModule {}
