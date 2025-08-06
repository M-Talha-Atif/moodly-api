// src/booking/booking.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtCookieGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    const result = await this.bookingService.createBooking(
      req.user.sub,
      createBookingDto,
    );

    if (result.success) {
      return {
        statusCode: HttpStatus.CREATED,
        message: result.message,
        data: result.data,
      };
    }
    console.error('Booking creation failed:', result.message);

    // Define the status code mapping with proper types
    const statusCodeMap: Record<string, number> = {
      NOT_FOUND: HttpStatus.NOT_FOUND,
      NO_AVAILABILITY: HttpStatus.CONFLICT,
      SERVER_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    // Get the status code with fallback to BAD_REQUEST
    const statusCode = result.errorType
      ? (statusCodeMap[result.errorType] ?? HttpStatus.BAD_REQUEST)
      : HttpStatus.BAD_REQUEST;

    throw new HttpException(
      {
        statusCode,
        message: result.message,
      },
      statusCode,
    );
  }

  @UseGuards(JwtCookieGuard)
  @Delete(':id')
  async cancelBooking(@Param('id') bookingId: string, @Req() req: any) {
    const result = await this.bookingService.cancelBooking(
      req.user.sub,
      bookingId,
    );

    if (!result.success) {
      // Define the status code mapping with type safety
      const statusCodeMap: Record<string, number> = {
        NOT_FOUND: HttpStatus.NOT_FOUND,
        NOT_OWNER: HttpStatus.FORBIDDEN,
        ALREADY_CANCELLED: HttpStatus.CONFLICT,
        CANCELLATION_WINDOW_PASSED: HttpStatus.BAD_REQUEST,
        EXPERIENCE_NOT_FOUND: HttpStatus.INTERNAL_SERVER_ERROR,
        EXPERIENCE_PAST: HttpStatus.BAD_REQUEST,
        NO_SPOTS_TO_RELEASE: HttpStatus.CONFLICT,
        SERVER_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
      };

      // Safely get the status code with fallback
      const statusCode = result.errorType
        ? (statusCodeMap[result.errorType] ?? HttpStatus.BAD_REQUEST)
        : HttpStatus.BAD_REQUEST;

      throw new HttpException(
        {
          statusCode,
          error: result.errorType || 'UNKNOWN_ERROR',
          message: result.message,
        },
        statusCode,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result.data,
    };
  }
}
