import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly gemini: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      this.logger.error(
        '❌ GEMINI_API_KEY is missing in environment variables.',
      );
      throw new Error('GEMINI_API_KEY not configured.');
    }

    this.logger.log('GeminiService initialized successfully.');
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateText(prompt: string): Promise<string> {
    this.logger.log(`Starting text generation with prompt: ${prompt}`);

    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      this.logger.log('Calling Gemini API...');
      const result = await model.generateContent(prompt);

      this.logger.log('Raw Gemini API response received.');

      const raw =
        result.response.text?.() ||
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '';

      if (!raw) {
        this.logger.warn('Gemini returned empty response content.');
      }

      //  Clean markdown fences if present
      const cleaned = raw.replace(/```json|```/g, '').trim();
      this.logger.log(`Gemini cleaned output: ${cleaned}`);

      return cleaned;
    } catch (error: any) {
      this.logger.error('Gemini generation error occurred.');
      this.logger.error(`Full error message: ${error.message}`);
      if (error.response?.data) {
        this.logger.error(
          `Error response data: ${JSON.stringify(error.response.data, null, 2)}`,
        );
      }
      if (error.stack) {
        this.logger.error(`Stack trace: ${error.stack}`);
      }
      throw new Error('Gemini text generation failed.');
    }
  }
}
