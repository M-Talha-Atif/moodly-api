// src/recommendation/recommendation.module.ts
import { Module } from '@nestjs/common';
import { RecommendationService } from './services/recommendation.service';
import { ExperienceModule } from 'src/experience/experience.module';
import { RedisModule } from 'src/redis/redis.module';
import { RecommendationController } from './recommendation.controller';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { RecommendationGateway } from './recommendation.gateway';
import { LLMRankingService } from './services/llm-ranking.service';
// 👇 new providers
import { OpenAIRankingProvider } from './providers/openai-ranking.provider';
import { GeminiRankingProvider } from './providers/gemini-ranking.provider';
import { MoodLogModule } from 'src/mood-log/mood-log.module';

@Module({
  imports: [ExperienceModule, RedisModule, EmbeddingModule, MoodLogModule],
  providers: [
    RecommendationService,
    RecommendationGateway,
    LLMRankingService,
    OpenAIRankingProvider,
    GeminiRankingProvider,
  ],
  controllers: [RecommendationController],
  exports: [
    RecommendationService,
    RecommendationGateway,
    LLMRankingService,
  ],
})
export class RecommendationModule { }
