// src/recommendation/providers/gemini-ranking.provider.ts
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  RankingProvider,
  Candidate,
} from '../interfaces/ranking-provider.interface';

@Injectable()
export class GeminiRankingProvider implements RankingProvider {
  private readonly logger = new Logger(GeminiRankingProvider.name);
  private readonly gemini: GoogleGenerativeAI;

  constructor() {
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async rerank(
    userContext: string,
    candidates: Candidate[],
  ): Promise<string[]> {
    const prompt = `
User context:
${userContext}

Candidates:
${candidates
  .map((c) => `- ${c.id}: ${c.title} - ${c.description ?? ''}`)
  .join('\n')}

Task:
Rank these candidates by relevance for the user.
Always include ALL candidate IDs in the output, even if they seem irrelevant.
Respond ONLY with a JSON array of IDs in ranked order.
  `.trim();

    const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const ids = JSON.parse(cleaned);

      if (Array.isArray(ids) && ids.length > 0) {
        return ids;
      }

      this.logger.warn(
        'Gemini returned empty or invalid ranking, falling back to original order',
      );
      return candidates.map((c) => c.id);
    } catch (err) {
      this.logger.error(`Failed to parse Gemini output: ${err.message}`);
      return candidates.map((c) => c.id);
    }
  }
}
