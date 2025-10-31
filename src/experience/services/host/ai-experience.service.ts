import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ApiClientService } from 'src/common/services/api-client.service';
import * as fs from 'fs';
import * as path from 'path';
import { GeminiService } from 'src/common/services/gemini.service';

@Injectable()
export class AiExperienceService {
  private readonly logger = new Logger(AiExperienceService.name);

  constructor(
    private readonly apiClient: ApiClientService,
    private readonly geminiService: GeminiService,
  ) {}

  /**
   * Handles both voice file and text input.
   * Converts voice → text if file provided, then uses Gemini to generate experience data.
   */
  async handleVoiceOrTextInput(file?: Express.Multer.File, voiceText?: string) {
    try {
      let textInput = voiceText;

      //  Directory for temporary voice uploads
      const uploadDir = path.join(process.cwd(), 'uploads', 'speech_to_text');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        this.logger.log(`Created directory: ${uploadDir}`);
      }

      // Convert voice to text via FastAPI
      if (file) {
        const tempFilePath = path.join(
          uploadDir,
          `speech_${Date.now()}_${file.originalname}`,
        );

        fs.writeFileSync(tempFilePath, file.buffer);
        this.logger.log(`Temp file saved at ${tempFilePath}`);

        this.logger.log('Sending audio to FastAPI for speech-to-text...');
        const sttResponse = await this.apiClient.postFile<{ text: string }>(
          '/speech-to-text',
          tempFilePath,
        );

        textInput = sttResponse?.text?.trim();
        this.logger.log(`Transcribed text: "${textInput}"`);

        // Cleanup temp file safely
        try {
          fs.unlinkSync(tempFilePath);
          this.logger.log(`Temp file cleaned up: ${tempFilePath}`);
        } catch (cleanupErr: any) {
          this.logger.warn(`Failed to delete temp file: ${cleanupErr.message}`);
        }
      }

      if (!textInput) {
        throw new HttpException('No valid text found', 400);
      }

      //  Generate AI experience data
      this.logger.log(' Generating experience data from text...');
      const aiResponse = await this.generateExperienceDataFromVoice(textInput);

      this.logger.log('AI generation successful.');
      return aiResponse;
    } catch (error: any) {
      this.logger.error(
        ' AI experience generation failed:',
        error.message || error,
      );
      throw new HttpException(
        error.message || 'AI generation failed',
        error.status || 500,
      );
    }
  }

  /**
   * Calls Gemini to generate structured experience data.
   */
  async generateExperienceDataFromVoice(voiceText: string) {
    const prompt = `
      You are an AI experience generator. Based on this input:
      "${voiceText}"
      Fill in the following JSON fields:
      {
        "title": string,
        "description": string,
        "isVirtual": boolean,
        "culturalTags": ["beach","music","dance","food","art","nature","festival","cultural"],
        "desiredOutcomes": ["happiness","calmness","relief","excitement","peace","inspiration","connection","relaxation"],
        "targetEmotions": ["happy","sad","angry","excited","calm","anxious","peaceful","inspired"],
        "emotionalSummary": string,
        "location": string (optional)
      }
      Return JSON only.
    `;

    const rawResponse = await this.geminiService.generateText(prompt);

    this.logger.log(` Cleaning Gemini response...`);
    const cleaned = rawResponse.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      console.log(e);
      this.logger.warn('Failed to parse Gemini JSON, returning raw text.');
      return { raw: cleaned };
    }
  }
}
