import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationService } from './services/recommendation.service';
import { ExperienceRecommendationService } from 'src/experience/experience-recommendation.service';
import { RedisService } from 'src/infra/redis/redis.service';
import { LLMRankingService } from './services/llm-ranking.service';

describe('RecommendationService', () => {
  let service: RecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        {
          provide: ExperienceRecommendationService,
          useValue: {
            recommendByEmotion: jest.fn(),
            recommendByEmbedding: jest.fn(),
          },
        },
        { provide: RedisService, useValue: { get: jest.fn(), set: jest.fn() } },
        { provide: LLMRankingService, useValue: { rerank: jest.fn() } },
      ],
    }).compile();

    service = module.get<RecommendationService>(RecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
