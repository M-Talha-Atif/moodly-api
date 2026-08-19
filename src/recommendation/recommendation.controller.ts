import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RecommendationService } from './services/recommendation.service';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MoodLogService } from 'src/mood-log/services/mood-log.service';
import { RolesGuard } from 'src/common/roles.guard';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('recommendations') // Groups under "recommendations"
@ApiBearerAuth() // shows JWT auth in Swagger UI
@SkipThrottle()
@Controller('recommendations')
@UseGuards(JwtCookieGuard, RolesGuard)
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly moodLogService: MoodLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get personalized recommendations' })
  @ApiResponse({
    status: 200,
    description: 'Recommendations generated successfully',
    schema: {
      example: [
        { id: 1, title: 'Watch a comedy movie', type: 'movie' },
        { id: 2, title: 'Go for a walk in the park', type: 'activity' },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No mood found for user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (JWT missing/invalid)',
  })
  async getRecommendations(@Req() req: any) {
    const moodResult = await this.moodLogService.getRecentMoodLog(req.user.sub);

    const userMood =
      (moodResult?.success && moodResult.data?.finalMood) ||
      moodResult?.data?.moodLabel || // Fallback to moodLabel if finalMood doesn't exist
      'neutral';

    return this.recommendationService.generateForUserByMood(
      req.user.sub,
      userMood.toLowerCase(),
    );
  }
}
