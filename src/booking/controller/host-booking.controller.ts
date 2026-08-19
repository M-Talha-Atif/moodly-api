// src/booking/controllers/host-booking.controller.ts
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HostBookingStatsService } from '../services/host/host-booking-stats.service';
import { HostBookingQueryService } from '../services/host/host-booking-query.service';
import { JwtCookieGuard } from '../../auth/guards/jwt-cookie.guard';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { ResultDto } from '../../common/dto/result.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Host Bookings')
@SkipThrottle()
@Controller('host/bookings')
@UseGuards(JwtCookieGuard, RolesGuard)
@Roles('host')
export class HostBookingController {
  constructor(
    private readonly hostBookingStatsService: HostBookingStatsService,
    private readonly hostBookingQueryService: HostBookingQueryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookings for host’s experiences' })
  async findAllHostBookings(@Req() req: any) {
    const hostId = req.user.sub;
    const bookings = await this.hostBookingQueryService.findAllForHost(hostId);
    return ResultDto.ok(bookings, 'Host bookings fetched successfully');
  }

  @Get('recent')
  @ApiOperation({
    summary: 'Get recent bookings (default 5) for host’s experiences',
  })
  async findRecentHostBookings(@Req() req: any) {
    const hostId = req.user.sub;
    const bookings = await this.hostBookingQueryService.findRecentForHost(
      hostId,
      5,
    );
    return ResultDto.ok(bookings, 'Recent host bookings fetched successfully');
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get booking stats for host dashboard' })
  async getHostBookingStats(@Req() req: any) {
    const hostId = req.user.sub;

    const [total, revenue, experiences, avgRating] = await Promise.all([
      this.hostBookingStatsService.getTotalBookingsForHost(hostId),
      this.hostBookingStatsService.getRevenueForHost(hostId),
      this.hostBookingStatsService.getExperienceCountForHost(hostId),
      this.hostBookingStatsService.getAvgRatingForHost(hostId),
    ]);

    return ResultDto.ok(
      { total, revenue, experiences, avgRating },
      'Host booking stats fetched successfully',
    );
  }

  @Get('trend')
  @ApiOperation({
    summary: 'Get booking trend (line chart data) for host dashboard',
  })
  async getBookingTrend(@Req() req: any) {
    const hostId = req.user.sub;

    const trend = await this.hostBookingQueryService.getBookingTrend(
      hostId,
      90, // last 90 days
    );

    return ResultDto.ok(trend, 'Booking trend fetched successfully');
  }

  @Get('emotional-outcomes')
  @ApiOperation({ summary: 'Get emotional outcome stats for host dashboard' })
  async getEmotionalOutcomes(@Req() req: any) {
    const hostId = req.user.sub;

    const result =
      await this.hostBookingQueryService.getEmotionalOutcomesForHost(hostId);

    return ResultDto.ok(result, 'Emotional outcomes fetched successfully');
  }

  @Get('funnel')
  @ApiOperation({ summary: 'Get booking funnel stats for host dashboard' })
  async getFunnel(@Req() req: any) {
    const hostId = req.user.sub;

    const result = await this.hostBookingQueryService.getFunnelForHost(hostId);

    return ResultDto.ok(result, 'Funnel stats fetched successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking detail for host’s experience' })
  async getHostBookingDetail(@Param('id') bookingId: string, @Req() req: any) {
    const hostId = req.user.sub;
    const booking = await this.hostBookingQueryService.findBookingForHost(
      hostId,
      bookingId,
    );
    return ResultDto.ok(booking, 'Host booking detail fetched successfully');
  }
}
