// src/booking/controllers/user-booking.controller.ts
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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BookingService } from '../services/user/booking.service';
import { BookingStatsService } from '../services/user/booking.stats.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { JwtCookieGuard } from '../../auth/guards/jwt-cookie.guard';
import { ERROR_CODE_MAP } from '../../common/constants/error-code-map';
import { ResultDto } from '../../common/dto/result.dto';
import { JwtBearerGuard } from 'src/auth/guards/jwt-bearer.guard';
import { RolesGuard } from '../../common/roles.guard';
import { SkipThrottle } from '@nestjs/throttler';
import {
  DEFAULT_BOOKINGS_PAGE,
  DEFAULT_BOOKINGS_PAGE_SIZE,
} from '../booking.constants';

@SkipThrottle()
@ApiTags('User Bookings')
@Controller('user/bookings')
@UseGuards(JwtBearerGuard, JwtCookieGuard, RolesGuard)
export class UserBookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingStatsService: BookingStatsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking request' })
  @ApiResponse({ status: 500, description: 'Unexpected server error' })
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
    } catch (error) {
      if (error instanceof HttpException) throw error;
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

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
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
      if (error instanceof HttpException) throw error;
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

  @Get()
  @ApiOperation({ summary: 'Get all bookings for the current user' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['confirmed', 'cancelled', 'waitlisted'],
  })
  @ApiQuery({
    name: 'timeFilter',
    required: false,
    enum: ['today', 'tomorrow', 'weekend', 'next-week'],
  })
  async findAllBookings(
    @Req() req: any,
    @Query('page') page = DEFAULT_BOOKINGS_PAGE,
    @Query('limit') limit = DEFAULT_BOOKINGS_PAGE_SIZE,
    @Query('status') status?: 'confirmed' | 'cancelled' | 'waitlisted',
    @Query('timeFilter')
    timeFilter?: 'today' | 'tomorrow' | 'weekend' | 'next-week',
  ) {
    const userId = req.user.sub;

    const bookings = await this.bookingService.findAllBookings(
      Number(page),
      Number(limit),
      userId,
      status,
      timeFilter,
    );

    return ResultDto.ok(
      { data: bookings.data, meta: { total: bookings.total } },
      'Bookings fetched successfully',
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get booking stats for current user' })
  async getBookingStats(@Req() req: any) {
    const userId = req.user.sub;

    const [total, upcoming, completed] = await Promise.all([
      this.bookingStatsService.getTotalBookings(userId),
      this.bookingStatsService.getUpcomingBookings(userId),
      this.bookingStatsService.getCompletedBookings(userId),
    ]);

    return ResultDto.ok(
      { total, upcoming, completed },
      'Booking stats fetched successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking detail by ID' })
  async getBookingDetail(@Param('id') bookingId: string, @Req() req: any) {
    const result = await this.bookingService.findBookingById(
      req.user.sub,
      bookingId,
    );

    if (!result.success) {
      throw new HttpException(result, result.statusCode);
    }

    return ResultDto.ok(result.data, 'Booking detail fetched successfully');
  }
}
