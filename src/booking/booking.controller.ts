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
import { ERROR_CODE_MAP } from '../common/constants/error-code-map';

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

    console.error('Booking creation failed:', result.reason);

    const statusCode = result.errorType
      ? (ERROR_CODE_MAP[result.errorType] ?? HttpStatus.BAD_REQUEST)
      : HttpStatus.BAD_REQUEST;

    throw new HttpException(
      {
        statusCode,
        message: result.reason,
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
      const statusCode = result.errorType
        ? (ERROR_CODE_MAP[result.errorType] ?? HttpStatus.BAD_REQUEST)
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
