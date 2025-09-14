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
import { BookingService } from './services/booking.service';
import { BookingStatsService } from './services/booking.stats.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';
import { ERROR_CODE_MAP } from '../common/constants/error-code-map';
import { ResultDto } from '../common/dto/result.dto';

// NestJS/Express best practice: hamesha static routes (stats, search, etc.) ko param routes (:id) se upar likho
@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingStatsService: BookingStatsService,
  ) {}

  @UseGuards(JwtCookieGuard)
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

  @UseGuards(JwtCookieGuard)
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

  @UseGuards(JwtCookieGuard)
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
  @ApiResponse({ status: 200, description: 'Bookings fetched successfully' })
  @ApiResponse({ status: 500, description: 'Failed to fetch bookings' })
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
      console.log(error);
      return ResultDto.fail(
        'Failed to fetch bookings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtCookieGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Get booking stats for current user' })
  @ApiResponse({
    status: 200,
    description: 'Booking stats fetched successfully',
  })
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

  @UseGuards(JwtCookieGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get booking detail by ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking detail fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
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
