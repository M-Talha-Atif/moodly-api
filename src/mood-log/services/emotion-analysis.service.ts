import { Injectable, Logger } from '@nestjs/common';
import { ApiClientService } from 'src/common/services/api-client.service';
import { ResultDto } from '../../common/dto/result.dto';
import { EmotionApiResponse } from '../interfaces/emotion-api-response-interface';

@Injectable()
export class EmotionAnalysisService {
  private readonly logger = new Logger(EmotionAnalysisService.name);

  constructor(private readonly apiClient: ApiClientService) {}

  async analyzeImageEmotion(
    filePath: string,
  ): Promise<ResultDto<EmotionApiResponse>> {
    try {
      const data = await this.apiClient.postFile<EmotionApiResponse>(
        '/analyze-image-emotion',
        filePath,
      );
      return ResultDto.ok(data, 'Analysis successful');
    } catch (error) {
      this.logger.error(`Image analysis failed: ${error.message}`, error.stack);
      return ResultDto.fail(error.message || 'Analysis error', 500);
    }
  }

  async analyzeVoiceEmotion(
    filePath: string,
  ): Promise<ResultDto<EmotionApiResponse>> {
    try {
      const data = await this.apiClient.postFile<EmotionApiResponse>(
        '/analyze-voice-emotion',
        filePath,
      );
      return ResultDto.ok(data, 'Analysis successful');
    } catch (error) {
      this.logger.error(`Voice analysis failed: ${error.message}`, error.stack);
      return ResultDto.fail(error.message || 'Analysis error', 500);
    }
  }
}
