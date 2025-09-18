// src/recommendation/services/llm-ranking.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RankingProvider,
  Candidate,
} from '../interfaces/ranking-provider.interface';
import { OpenAIRankingProvider } from '../providers/openai-ranking.provider';
import { GeminiRankingProvider } from '../providers/gemini-ranking.provider';

@Injectable()
export class LLMRankingService {
  private readonly logger = new Logger(LLMRankingService.name);
  private readonly provider: RankingProvider;

  constructor(private readonly config: ConfigService) {
    const providerName =
      this.config.get<string>('RANKING_PROVIDER') || 'openai';

    if (providerName === 'gemini') {
      this.provider = new GeminiRankingProvider();
    } else {
      this.provider = new OpenAIRankingProvider(this.config);
    }

    this.logger.log(`📦 Using ${providerName} as ranking provider`);
  }

  async rerank(
    userContext: string,
    candidates: Candidate[],
  ): Promise<string[]> {
    if (!candidates?.length) {
      this.logger.warn('⚠️ No candidates to rerank');
      return [];
    }
    if (!userContext?.trim()) {
      this.logger.warn('⚠️ Empty user context, fallback to original order');
      return candidates.map((c) => c.id);
    }
    return this.provider.rerank(userContext, candidates);
  }
}
