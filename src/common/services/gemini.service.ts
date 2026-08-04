import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly gemini: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      this.logger.error('GEMINI_API_KEY is missing in environment variables.');
      throw new Error('GEMINI_API_KEY not configured.');
    }

    this.logger.log('GeminiService initialized successfully.');
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const result = await model.generateContent(prompt);

      const raw =
        result.response.text?.() ||
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '';

      if (!raw) {
        this.logger.warn('Gemini returned empty response content.');
      }

      // Strip markdown code fences, since the model sometimes wraps JSON in ```json blocks
      // despite prompts asking for raw JSON.
      return raw.replace(/```json|```/g, '').trim();
    } catch (error: any) {
      this.logger.error(`Gemini generation failed: ${error.message}`);
      throw new Error('Gemini text generation failed.');
    }
  }
}
