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

    this.logger.log(`📩 Gemini prompt: ${prompt}`);

    const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    // 👉 full Gemini SDK response for debugging
    this.logger.log(
      `🛠️ Gemini full response: ${JSON.stringify(result, null, 2)}`,
    );

    const raw = result.response.text().trim();

    this.logger.log(`📩 Gemini raw output (before clean): ${raw}`);

    try {
      // 🧹 Clean markdown fences if present
      const cleaned = raw.replace(/```json|```/g, '').trim();
      this.logger.log(`🧹 Gemini cleaned output: ${cleaned}`);

      const ids = JSON.parse(cleaned);
      this.logger.log(`✅ Parsed IDs from Gemini: ${JSON.stringify(ids)}`);

      if (Array.isArray(ids) && ids.length > 0) {
        this.logger.log(
          `🎯 Gemini successfully returned ranking: ${JSON.stringify(ids)}`,
        );
        return ids;
      }

      this.logger.warn(
        '⚠️ Gemini returned empty or invalid ranking, falling back to original order',
      );
      return candidates.map((c) => c.id);
    } catch (err) {
      this.logger.error(`❌ Failed to parse Gemini output`);
      this.logger.error(`Message: ${err.message}`);
      return candidates.map((c) => c.id);
    }
  }
}
