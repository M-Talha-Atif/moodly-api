// src/booking/booking.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';
import { ERROR_CODE_MAP } from '../common/constants/error-code-map';
import { Query } from '@nestjs/common';
import { ResultDto } from '../common/dto/result.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtCookieGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    try {
      const result = await this.bookingService.createBooking(
        req.user.sub,
        createBookingDto,
      );

      if (result.success) {
        return ResultDto.ok(
          result.data,
          'Booking created successfully',
          HttpStatus.CREATED,
        );
      }

      console.error('Booking creation failed:', result.reason);

      const statusCode = result.errorType
        ? (ERROR_CODE_MAP[result.errorType] ?? HttpStatus.BAD_REQUEST)
        : HttpStatus.BAD_REQUEST;

      // ❌ Instead of returning a fail object → ❗ throw an HttpException
      throw new HttpException(
        {
          success: false,
          statusCode,
          reason: result.reason ?? 'Unknown error',
          errorType: result.errorType ?? 'UNKNOWN_ERROR',
        },
        statusCode,
      );
    } catch (error) {
      console.error('Unexpected error creating booking:', error);

      // If it's already an HttpException, just rethrow so Nest handles it
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          reason: 'Unexpected error occurred',
          errorType: 'SERVER_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtCookieGuard)
  @Delete(':id')
  async cancelBooking(@Param('id') bookingId: string, @Req() req: any) {
    try {
      const result = await this.bookingService.cancelBooking(
        req.user.sub,
        bookingId,
      );

      if (!result.success) {
        const statusCode = result.errorType
          ? (ERROR_CODE_MAP[result.errorType] ?? HttpStatus.BAD_REQUEST)
          : HttpStatus.BAD_REQUEST;

        throw new HttpException(
          {
            success: false,
            statusCode,
            reason: result.reason ?? 'Unknown error',
            errorType: result.errorType ?? 'UNKNOWN_ERROR',
          },
          statusCode,
        );
      }

      return ResultDto.ok(
        result.data,
        result.message ?? 'Booking cancelled successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          reason: 'Unexpected error occurred',
          errorType: 'SERVER_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtCookieGuard)
  @Get()
  async findAllBookings(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: 'confirmed' | 'cancelled' | 'waitlisted',
    @Query('timeFilter')
    timeFilter?: 'today' | 'tomorrow' | 'weekend' | 'next-week',
  ) {
    try {
      const userId = req.user.sub;

      const bookings = await this.bookingService.findAllBookings(
        Number(page),
        Number(limit),
        userId,
        status,
        timeFilter,
      );

      return ResultDto.ok(
        {
          data: bookings.data,
          meta: { total: bookings.total },
        },
        'Bookings fetched successfully',
      );
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      return ResultDto.fail(
        'Failed to fetch bookings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtCookieGuard)
  @Get(':id')
  async getBookingDetail(@Param('id') bookingId: string, @Req() req: any) {
    const result = await this.bookingService.findBookingById(
      req.user.sub,
      bookingId,
    );

    if (!result.success) {
      throw new HttpException(
        {
          success: false,
          statusCode: result.statusCode,
          reason: result.reason,
          errorType: result.errorType,
        },
        result.statusCode,
      );
    }

    return ResultDto.ok(result.data, 'Booking detail fetched successfully');
  }
}
