import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InsightsService } from '../services/insights.service';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { ResultDto } from 'src/common/dto/result.dto';

@ApiTags('Insights')
@Controller('insights')
@UseGuards(JwtCookieGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  async getOverview(@Req() req: any, @Query('moodDays') moodDays?: string) {
    const userId = req.user.sub;
    const days = moodDays ? Number(moodDays) : undefined;
    const insights = await this.insightsService.getUserInsights(userId, {
      moodDays: days,
    });

    return ResultDto.ok(insights, 'Insights fetched successfully');
  }
}
