// emotion-detection.service.ts
import { Injectable, Logger } from '@nestjs/common';
import FormData from 'form-data';
import axios, { AxiosError } from 'axios';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmotionDetectionService {
  private readonly logger = new Logger(EmotionDetectionService.name);
  private readonly fastApiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.fastApiUrl =
      this.configService.get<string>('FASTAPI_EMOTION_URL') ??
      'http://localhost:8000/detect-emotion';
  }

  async detectEmotionFromFile(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      this.logger.error('File not found');
      throw new Error('File not found');
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      filename: filePath.split('/').pop(),
    });

    try {
      this.logger.log('Sending request to FastAPI service');
      const response = await axios.post(this.fastApiUrl, formData, {
        headers: formData.getHeaders(),
        timeout: 5000,
      });

      this.logger.log(`Received response: ${JSON.stringify(response.data)}`);

      if (!response.data.success) {
        this.logger.error(`Service returned error: ${response.data.reason}`);
        throw new Error(response.data.reason || 'Emotion detection failed');
      }

      if (!response.data.data?.dominant_emotion) {
        this.logger.error('No dominant_emotion in response data');
        throw new Error('No emotion detected in response');
      }

      return response.data.data.dominant_emotion;
    } catch (error) {
      this.logger.error(`Emotion detection failed: ${error.message}`);

      if (error.response) {
        // Handle FastAPI specific errors
        const errorMessage =
          error.response.data?.reason || 'Emotion detection service error';
        this.logger.error(
          `Service error details: ${JSON.stringify(error.response.data)}`,
        );
        throw new Error(errorMessage);
      }

      throw new Error(error.message || 'Failed to process emotion detection');
    } finally {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          this.logger.log('Temporary file deleted');
        }
      } catch (err) {
        this.logger.error(`Failed to delete temp file: ${err.message}`);
      }
    }
  }
}
