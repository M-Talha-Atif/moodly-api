import { Injectable, Logger } from '@nestjs/common';
import { ApiClientService } from 'src/common/services/api-client.service';
import { FileDownloadService } from 'src/common/services/file-download.service';
import { ResultDto } from '../../common/dto/result.dto';
import { EmotionApiResponse } from '../interfaces/emotion-api-response-interface';

@Injectable()
export class EmotionAnalysisService {
  private readonly logger = new Logger(EmotionAnalysisService.name);

  constructor(
    private readonly apiClient: ApiClientService,
    private readonly fileDownloadService: FileDownloadService,
  ) {}

  async analyzeImageEmotion(
    filePathOrUrl: string, // Now accepts both local paths and S3 URLs
  ): Promise<ResultDto<EmotionApiResponse>> {
    let tempFilePath: string | null = null;

    try {
      // Check if it's an S3 URL or local path
      if (this.isS3Url(filePathOrUrl)) {
        tempFilePath =
          await this.fileDownloadService.downloadFromS3Url(filePathOrUrl);
      } else {
        tempFilePath = filePathOrUrl;
      }

      const data = await this.apiClient.postFile<EmotionApiResponse>(
        '/analyze-image-emotion',
        tempFilePath,
      );

      return ResultDto.ok(data, 'Analysis successful');
    } catch (error) {
      this.logger.error(`Image analysis failed: ${error.message}`, error.stack);
      return ResultDto.fail(error.message || 'Analysis error', 500);
    } finally {
      // Only cleanup if we downloaded a temporary file
      if (tempFilePath && this.isS3Url(filePathOrUrl)) {
        await this.fileDownloadService.cleanupTempFile(tempFilePath);
      }
    }
  }

  async analyzeVoiceEmotion(
    filePathOrUrl: string,
  ): Promise<ResultDto<EmotionApiResponse>> {
    let tempFilePath: string | null = null;

    try {
      if (this.isS3Url(filePathOrUrl)) {
        tempFilePath =
          await this.fileDownloadService.downloadFromS3Url(filePathOrUrl);
      } else {
        tempFilePath = filePathOrUrl;
      }

      const data = await this.apiClient.postFile<EmotionApiResponse>(
        '/analyze-voice-emotion',
        tempFilePath,
      );

      return ResultDto.ok(data, 'Analysis successful');
    } catch (error) {
      this.logger.error(`Voice analysis failed: ${error.message}`, error.stack);
      return ResultDto.fail(error.message || 'Analysis error', 500);
    } finally {
      if (tempFilePath && this.isS3Url(filePathOrUrl)) {
        await this.fileDownloadService.cleanupTempFile(tempFilePath);
      }
    }
  }

  private isS3Url(path: string): boolean {
    return path.startsWith('http') && path.includes(process.env.S3_BASE_URL!);
  }
}
