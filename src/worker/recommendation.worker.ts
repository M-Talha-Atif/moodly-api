import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RecommendationService } from '../recommendation/services/recommendation.service';
import { RecommendationGateway } from '../recommendation/recommendation.gateway';
import { RMQ_DOMAINS } from 'src/infra/config/rmq.constants';

// type RecommendationPayload = {
//   userId: string;
//   embedding: number[];
//   context: string;
// };

type RecommendationPayload = {
  userId: string;
  userMood: string;
};

@Controller()
export class RecommendationWorker {
  private readonly logger = new Logger(RecommendationWorker.name);

  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly recommendationGateway: RecommendationGateway,
  ) {}

  @EventPattern(RMQ_DOMAINS.RECOMMENDATION.ROUTING.GENERATE)
  async handleGenerate(@Payload() payload: RecommendationPayload) {
    this.logger.log(
      `Processing recommendation for user in broker ${payload.userId}`,
    );

    try {
      const recommendations =
        await this.recommendationService.generateForUserByMood(
          payload.userId,
          payload.userMood,
          10,
        );

      this.logger.log(
        `Got ${recommendations.length} recommendations for user ${payload.userId} with user mood ${payload.userMood}`,
      );

      // Emit via socket
      this.recommendationGateway.sendRecommendations(
        payload.userId,
        recommendations,
      );
    } catch (err) {
      this.logger.error(
        ` Failed to process recommendation for ${payload.userId}`,
        err,
      );
      throw err;
    }
  }
}
