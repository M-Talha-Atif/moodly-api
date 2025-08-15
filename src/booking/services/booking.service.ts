import { Injectable, Logger, HttpException } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingResponseDto } from '../dto/booking-response.dto';
import { ResultDto } from '../../common/dto/result.dto';
import { ERROR_CODE_MAP } from '../../common/constants/error-code-map';
import { BookingCreationService } from './booking-creation.service';
import { BookingCancellationService } from './booking-cancellation.service';
import { BookingQueryService } from './booking-query.service';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly bookingCreationService: BookingCreationService,
    private readonly bookingCancellationService: BookingCancellationService,
    private readonly bookingQueryService: BookingQueryService,
  ) {}

  async createBooking(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<ResultDto<BookingResponseDto>> {
    try {
      return await this.bookingCreationService.createBooking(userId, dto);
    } catch (error) {
      this.logger.error(
        `Booking creation failed: ${error?.message}`,
        error?.stack,
      );

      if (error instanceof HttpException) {
        const status = error.getStatus();
        return ResultDto.fail(
          error.message,
          status,
          this.mapHttpStatusToErrorType(status),
        );
      }

      return ResultDto.fail(
        'Failed to create booking. Please try again.',
        ERROR_CODE_MAP.SERVER_ERROR,
        'SERVER_ERROR',
      );
    }
  }

  private mapHttpStatusToErrorType(status: number): string {
    switch (status) {
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'ALREADY_BOOKED';
      case 400:
        return 'NO_AVAILABILITY';
      default:
        return 'UNKNOWN_ERROR';
    }
  }

  async cancelBooking(
    userId: string,
    bookingId: string,
  ): Promise<ResultDto<any>> {
    try {
      return await this.bookingCancellationService.cancelBooking(
        userId,
        bookingId,
      );
    } catch (error) {
      this.logger.error(
        `Booking cancellation failed: ${error?.message}`,
        error?.stack,
      );
      return ResultDto.fail(
        'Failed to cancel booking. Please try again.',
        ERROR_CODE_MAP.SERVER_ERROR,
        'SERVER_ERROR',
      );
    }
  }

  async findAllBookings(
    page = 1,
    limit = 10,
    userId?: string,
    status?: 'confirmed' | 'cancelled' | 'waitlisted',
    timeFilter?: 'today' | 'tomorrow' | 'weekend' | 'next-week',
  ): Promise<{ data: BookingResponseDto[]; total: number }> {
    return this.bookingQueryService.findAllBookings(
      page,
      limit,
      userId,
      status,
      timeFilter,
    );
  }
}
