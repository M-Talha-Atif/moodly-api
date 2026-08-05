import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
// There is no single flat BookingController anymore, it split into host/user
// controllers (src/booking/controller/). This spec covers the user-facing one.
import { UserBookingController } from './controller/user-booking.controller';
import { BookingService } from './services/user/booking.service';
import { BookingStatsService } from './services/user/booking.stats.service';

describe('UserBookingController', () => {
  let controller: UserBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBookingController],
      providers: [
        {
          provide: BookingService,
          useValue: {
            createBooking: jest.fn(),
            cancelBooking: jest.fn(),
            findAllBookings: jest.fn(),
            findBookingById: jest.fn(),
          },
        },
        {
          provide: BookingStatsService,
          useValue: {
            getTotalBookings: jest.fn(),
            getUpcomingBookings: jest.fn(),
            getCompletedBookings: jest.fn(),
          },
        },
        // JwtBearerGuard and JwtCookieGuard are both applied at the controller level.
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      ],
    }).compile();

    controller = module.get<UserBookingController>(UserBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
