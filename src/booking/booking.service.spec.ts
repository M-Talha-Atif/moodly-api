import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './services/user/booking.service';
import { BookingCreationService } from './services/user/booking-creation.service';
import { BookingCancellationService } from './services/user/booking-cancellation.service';
import { BookingQueryService } from './services/user/booking-query.service';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: BookingCreationService,
          useValue: { createBooking: jest.fn() },
        },
        {
          provide: BookingCancellationService,
          useValue: { cancelBooking: jest.fn() },
        },
        {
          provide: BookingQueryService,
          useValue: { findAllBookings: jest.fn(), findBookingById: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
