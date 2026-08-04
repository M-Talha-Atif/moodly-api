import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ApiClientService } from 'src/common/services/api-client.service';
import * as fs from 'fs';
import * as path from 'path';
import { GeminiService } from 'src/common/services/gemini.service';
import { Experience } from 'src/experience/entities/experience.entity';

@Injectable()
export class AiExperienceService {
  private readonly logger = new Logger(AiExperienceService.name);

  private readonly BASE_IMAGE_URL = process.env.EXPERIENCE_IMAGES_CDN_URL || '';

  private readonly EXPERIENCE_IMAGE_MAP: Record<string, string[]> = {
    Adventures: [
      `${this.BASE_IMAGE_URL}/Adventures/Adventures_001.jpg`,
      `${this.BASE_IMAGE_URL}/Adventures/Adventures_002.jpg`,
    ],
    Art: [`${this.BASE_IMAGE_URL}/Art/Art_001.jpg`],
    Cooking: [`${this.BASE_IMAGE_URL}/Cooking/Cooking_001.jpg`],
    Fitness: [`${this.BASE_IMAGE_URL}/Fitness/Fitness_001.jpg`],
    Meditation: [`${this.BASE_IMAGE_URL}/Meditation/Meditation_001.jpg`],
    Music: [`${this.BASE_IMAGE_URL}/Music/Music_001.jpg`],
    Poetry: [`${this.BASE_IMAGE_URL}/Poetry/Poetry_001.jpg`],
    Sports: [`${this.BASE_IMAGE_URL}/Sports/Sports_001.jpg`],
    Therapy: [
      `${this.BASE_IMAGE_URL}/Therapy/Therapy_001.jpg`,
      `${this.BASE_IMAGE_URL}/Therapy/Therapy_002.jpg`,
    ],
    General: [`${this.BASE_IMAGE_URL}/General/General_001.jpg`],
  };

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

      // --- Add category & image ---
      const category = aiResponse.category || 'General';
      const image = this.pickImageForCategory(category);

      this.logger.log(`Category : ${category}`);

      this.logger.log('AI generation successful.');
      return {
        ...aiResponse,
        image,
      };
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
You are an AI assistant that converts voice descriptions into structured experience data.

**CRITICAL INSTRUCTION:** Your PRIMARY goal is to PRESERVE the user's exact specifications. Only enhance or suggest alternatives when information is missing or unclear.

**USER'S VOICE INPUT:**
"${voiceText}"

**YOUR TASK:**
Extract and structure the following fields. Follow these rules STRICTLY:

1. **title**: 
   - IF user provided a title → USE IT EXACTLY as spoken (clean up only obvious speech-to-text errors)
   - IF no title provided → Create a compelling 5-8 word title
   - Example: User says "recording bites" → Use "Recording Bites" (preserve their words)

2. **description**: 
   - IF user provided description → USE THEIR WORDS as the foundation, enhance minimally (2-3 sentences max)
   - IF user says "same like that" or similar → Create sensory, outcome-focused description based on the title/activity
   - Focus on: what happens, who it's for, what they'll gain
   - ❌ NEVER mention time, duration, or schedule in description
   - Keep it authentic to user's original intent

3. **sessionStartTime**: 
   - IF user specified time → USE THAT EXACT TIME
   - Convert to ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sss+05:00 (Pakistan timezone)
   - Set to a logical FUTURE date (prefer next occurrence of appropriate day)
   - Example: "6:00 p.m." → "2024-11-23T18:00:00.000+05:00" (use next Saturday if social activity)

4. **sessionEndTime**: 
   - IF user specified end time → USE THAT EXACT TIME
   - IF not specified → Add logical duration (1-2 hours typical)
   - Must be after sessionStartTime
   - Example: "7:00 p.m." → "2024-11-23T19:00:00.000+05:00"

5. **date**: 
   - Extract from sessionStartTime
   - Format: YYYY-MM-DD
   - Must be FUTURE date

6. **location**: 
   - IF user specified location → USE IT EXACTLY (clean up speech-to-text errors)
   - IF not specified → Suggest "To Be Determined" or generic attractive location
   - Example: "Lahore shut up garden" → "Shalimar Garden, Lahore" (correct the speech error)

7. **isVirtual**: 
   - Default: false
   - Set to true ONLY if explicitly mentioned: "online", "virtual", "zoom", "remote"

8. **totalSpots**: 
   - IF user specified → USE THAT NUMBER
   - IF not specified → Suggest 10-15 for group activities, 5-8 for intimate experiences

9. **category**: (choose one from: Adventures, Art, Cooking, Fitness, Meditation, Music, Poetry, Sports, Therapy, General)

**SPEECH-TO-TEXT ERROR CORRECTION:**
- "shut up garden" → "Shalimar Garden"
- "and time" → "end time"
- Fix obvious homophones and transcription errors
- Preserve user's intent and terminology

**OUTPUT FORMAT:**
Return ONLY a valid JSON object with this exact structure:
{
  "title": "exact or minimally enhanced user title",
  "description": "2-3 sentences based on user's words or title",
  "isVirtual": boolean,
  "totalSpots": number,
  "sessionStartTime": "ISO 8601 with +05:00 timezone",
  "sessionEndTime": "ISO 8601 with +05:00 timezone",
  "date": "YYYY-MM-DD",
  "location": "user's location or cleaned version",
  "category": string
}

**CRITICAL:** 
- Return ONLY the JSON object
- NO markdown code blocks
- NO explanations
- NO additional text
- Preserve user's specifications above all else
`;

    const rawResponse = await this.geminiService.generateText(prompt);

    this.logger.log(` Cleaning Gemini response...`);
    const cleaned = rawResponse.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch {
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

Return ONLY a JSON object with keys: experienceOutcomeSummary, culturalTags, desiredOutcomes, targetEmotions.
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

  /**
   * Pick a random image for the given category. Defaults to General.
   */
  private pickImageForCategory(category: string): string {
    const images =
      this.EXPERIENCE_IMAGE_MAP[category] ||
      this.EXPERIENCE_IMAGE_MAP['General'];
    return images[Math.floor(Math.random() * images.length)];
  }
}
