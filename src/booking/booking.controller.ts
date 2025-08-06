// src/booking/booking.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
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
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: any,
  ) {
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
      'NOT_FOUND': HttpStatus.NOT_FOUND,
      'NO_AVAILABILITY': HttpStatus.CONFLICT,
      'SERVER_ERROR': HttpStatus.INTERNAL_SERVER_ERROR,
    };

    // Get the status code with fallback to BAD_REQUEST
    const statusCode = result.errorType 
      ? statusCodeMap[result.errorType] ?? HttpStatus.BAD_REQUEST
      : HttpStatus.BAD_REQUEST;

    throw new HttpException(
      {
        statusCode,
        message: result.message,
      },
      statusCode,
    );
  }
}