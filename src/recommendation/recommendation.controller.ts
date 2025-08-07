import {
  Controller,
  Get,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { MoodLogService } from 'src/mood-log/mood-log.service';
import { JwtCookieGuard } from 'src/auth/jwt-cookie.guard';

@Controller('recommendations')
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly moodLogService: MoodLogService,
  ) {}

  @UseGuards(JwtCookieGuard)
  @Get()
  async getRecommendations(@Req() req: any) {
    console.log('Fetching recommendations for user:', req.user.sub);
    const embedding = await this.moodLogService.getLatestUserEmbedding(
      req.user.sub,
    );
    // console.log('User embedding:', embedding);

    if (!embedding)
      throw new NotFoundException('No mood embedding found for user');

    return this.recommendationService.generateForUser(req.user.sub, embedding);
  }
}
