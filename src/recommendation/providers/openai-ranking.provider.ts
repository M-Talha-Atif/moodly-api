// src/recommendation/providers/openai-ranking.provider.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  RankingProvider,
  Candidate,
} from '../interfaces/ranking-provider.interface';
import { RANKING_TEMPERATURE } from '../recommendation.constants';

@Injectable()
export class OpenAIRankingProvider implements RankingProvider {
  private readonly logger = new Logger(OpenAIRankingProvider.name);
  private readonly openai: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }

  async rerank(
    userContext: string,
    candidates: Candidate[],
  ): Promise<string[]> {
    const prompt = `
User context:
${userContext}

Candidates:
${candidates.map((c) => `- ${c.id}: ${c.title} - ${c.description ?? ''}`).join('\n')}

Task:
Rank these candidates by relevance for the user.
Respond ONLY with a JSON array of IDs in ranked order.
    `.trim();

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: RANKING_TEMPERATURE,
    });

    const raw = response.choices[0].message?.content?.trim() ?? '[]';

    try {
      const ids = JSON.parse(raw);
      return Array.isArray(ids) ? ids : candidates.map((c) => c.id);
    } catch {
      return candidates.map((c) => c.id);
    }
  }
}
