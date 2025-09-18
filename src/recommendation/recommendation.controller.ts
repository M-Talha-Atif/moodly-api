import {
  Controller,
  Get,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { RecommendationService } from './services/recommendation.service';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { UserEmbeddingService } from 'src/embedding/services/user-embedding.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('recommendations') // Groups under "recommendations"
@ApiBearerAuth() // shows JWT auth in Swagger UI
@Controller('recommendations')
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly userEmbeddingService: UserEmbeddingService,
  ) {}

  @UseGuards(JwtCookieGuard)
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
    description: 'No mood embedding found for user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (JWT missing/invalid)',
  })
  async getRecommendations(@Req() req: any) {
    console.log('Fetching recommendations for user:', req.user.sub);

    const embedding = await this.userEmbeddingService.getLatestUserEmbedding(
      req.user.sub,
    );

    if (!embedding)
      throw new NotFoundException('No mood embedding found for user');

    return this.recommendationService.generateForUser(req.user.sub, embedding);
  }
}
