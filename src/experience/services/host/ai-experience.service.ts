import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ApiClientService } from 'src/common/services/api-client.service';
import * as fs from 'fs';
import * as path from 'path';
import { GeminiService } from 'src/common/services/gemini.service';
import { Experience } from 'src/experience/entities/experience.entity';

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
You are an expert experience curator and wellness event designer specializing in mood-based therapeutic activities. Your role is to transform user ideas into compelling, bookable experiences that align with current wellness trends (2024-2025).

**INPUT TO ANALYZE:**
"${voiceText}"

**CONTEXT & TRENDS TO CONSIDER:**
- Emphasize authentic, transformative experiences over passive entertainment
- Incorporate elements of mindfulness, community connection, and personal growth
- Reference current wellness movements: sound healing, forest bathing, creative expression therapy, somatic practices, digital detox activities
- Consider seasonal relevance and local cultural authenticity
- Design for small, intimate groups that foster genuine connection
- Focus on outcomes: stress relief, emotional regulation, social connection, creative expression

Fill in the following JSON fields:
{
  "title": string,    // Compelling, specific, 5-8 words. Use active language that conveys transformation
  "description": string,  // 2-3 sentences. Focus on WHAT happens, WHO it's for, and WHAT they'll gain. Be sensory and evocative. Never mention time/schedule details
  "isVirtual": boolean,  // Default to false unless explicitly mentioned as online/virtual/remote
  "totalSpots": number, 
  "sessionStartTime": string,  // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ), must be future, consider appropriate time for activity type
  "sessionEndTime": string,    // ISO 8601 format, logical duration based on activity (1-4 hours typical)
  "date": string,              // ISO 8601 date format (YYYY-MM-DD), must be future
  "location": string // Specific venue/address if mentioned, otherwise attractive generic location matching the vibe (e.g., "Waterfront Studio" or "Urban Garden Space")
}
**CRITICAL RULES:**
1. ❌ NEVER include time, duration, or schedule details in the description
2. ✅ Adjust any past dates/times to logical future dates (suggest weekends for social activities, evenings for after-work events)
3. ✅ Make descriptions sensory and outcome-focused: what will participants see, feel, create, or discover?
4. ✅ Title should be unique and evocative, not generic (Bad: "Yoga Class" / Good: "Sunset Flow: Restorative Yoga by the Bay")
5. ✅ Match activity intensity to appropriate duration and time of day
6. ✅ Return ONLY valid JSON, no markdown, no explanations, no extra text
7. ✅ Ensure all ISO 8601 timestamps are properly formatted with timezone

**OUTPUT:** Return only the JSON object, nothing else
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

  /**
   * Calls Gemini to generate AI fields for an experience based on title & description.
   * Generates only:
   * - emotionalSummary (1 line, clear, easy English)
   * - culturalTags (3-4 picked from fixed list)
   * - desiredOutcomes (3-4 picked from fixed list)
   * - targetEmotions (3-4 picked from fixed list)
   */
  async generateExperienceFields(experience: Experience) {
    const prompt = `
You are an expert experience curator for wellness events. Transform the following experience details into structured output.

**INPUT EXPERIENCE DESCRIPTION:**
Title: "${experience.title}"
Description: "${experience.description}"

**FIXED ARRAYS (do NOT change):**
"culturalTags": ["beach","music","dance","food","art","nature","festival","cultural"],
"desiredOutcomes": ["happiness","calmness","relief","excitement","peace","inspiration","connection","relaxation"],
"targetEmotions": ["happy","sad","angry","excited","calm","anxious","peaceful","inspired"]

**GENERATE ONLY:**
1. experienceOutcomeSummary: 1 sentence explaining who this experience is perfect for and the emotional shift (easy English, clear, no jargon)
2. culturalTags: pick 3-4 relevant tags from the fixed list
3. desiredOutcomes: pick 3-4 relevant outcomes from the fixed list
4. targetEmotions: pick 3-4 relevant emotions from the fixed list

Return ONLY a JSON object with keys: emotionalSummary, culturalTags, desiredOutcomes, targetEmotions.
No extra text, markdown, or explanations.
`;

    const rawResponse = await this.geminiService.generateText(prompt);
    const cleaned = rawResponse.replace(/```json|```/g, '').trim();

    try {
      const aiData = JSON.parse(cleaned);

      return {
        experienceOutcomeSummary: aiData.experienceOutcomeSummary || '',
        culturalTags: aiData.culturalTags || [],
        desiredOutcomes: aiData.desiredOutcomes || [],
        targetEmotions: aiData.targetEmotions || [],
      };
    } catch (err) {
      this.logger.warn('Failed to parse Gemini JSON, returning defaults.', err);
      return {
        experienceOutcomeSummary: '',
        culturalTags: [],
        desiredOutcomes: [],
        targetEmotions: [],
      };
    }
  }
}
