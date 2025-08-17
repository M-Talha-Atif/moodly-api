import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { ResultDto } from '../../common/dto/result.dto';
import { ValidationService } from './validation.service';
import { EmotionApiResponse } from '../interfaces/emotion-api-response-interface';

/**
 * Service for detecting emotions from media files (images/audio)
 */
@Injectable()
export class EmotionAnalysisService {
  private readonly logger = new Logger(EmotionAnalysisService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
  ) {}

  /**
   * Analyzes an image file for emotional content
   */
  async analyzeImageEmotion(
    filePath: string,
  ): Promise<ResultDto<EmotionApiResponse>> {
    return this.sendForAnalysis(filePath, 'image');
  }

  /**
   * Analyzes a voice recording for emotional content
   */
  async analyzeVoiceEmotion(
    filePath: string,
  ): Promise<ResultDto<EmotionApiResponse>> {
    const validation = this.validationService.validateVoiceFile(filePath);
    if (!validation.success) {
      return validation as ResultDto<EmotionApiResponse>;
    }
    return this.sendForAnalysis(filePath, 'voice');
  }

  /**
   * Sends file to analysis API
   */
  private async sendForAnalysis(
    filePath: string,
    analysisType: 'image' | 'voice',
  ): Promise<ResultDto<EmotionApiResponse>> {
    try {
      if (!fs.existsSync(filePath)) {
        this.logger.warn(`File not found: ${filePath}`);
        return ResultDto.fail<EmotionApiResponse>(
          `${analysisType} file not found`,
          404,
          'FILE_NOT_FOUND',
        );
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath), {
        filename: filePath.split('/').pop(),
      });

      const apiUrl = this.getApiEndpoint(analysisType);
      this.logger.debug(`Sending ${analysisType} for analysis to ${apiUrl}`);

      const response = await axios.post(apiUrl, formData, {
        headers: formData.getHeaders(),
        timeout: 15000,
      });

      return ResultDto.ok<EmotionApiResponse>(
        response.data,
        'Analysis successful',
      );
    } catch (error) {
      return this.handleAnalysisError(error as AxiosError);
    } finally {
      this.cleanupTempFile(filePath);
    }
  }

  private getApiEndpoint(serviceType: 'image' | 'voice'): string {
    return (
      this.configService.get<string>(
        `EMOTION_API_${serviceType.toUpperCase()}_URL`,
      ) ?? `http://localhost:8000/analyze-${serviceType}-emotion`
    );
  }

  private handleAnalysisError(
    error: AxiosError,
  ): ResultDto<EmotionApiResponse> {
    this.logger.error(`Analysis API error: ${error.message}`);

    if (error.response) {
      const responseData = error.response.data as {
        reason?: string;
        errorType?: string;
      };

      return ResultDto.fail<EmotionApiResponse>(
        responseData.reason || 'Analysis service error',
        error.response.status,
        responseData.errorType || 'ANALYSIS_ERROR',
      );
    }

    if (error.request) {
      return ResultDto.fail<EmotionApiResponse>(
        'Analysis service unavailable',
        503,
        'SERVICE_UNAVAILABLE',
      );
    }

    return ResultDto.fail<EmotionApiResponse>(
      'Internal processing error',
      500,
      'INTERNAL_ERROR',
    );
  }

  private cleanupTempFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.verbose(`Cleaned up temporary file: ${filePath}`);
      }
    } catch (err) {
      this.logger.warn(
        `Failed to cleanup temporary file ${filePath}: ${err.message}`,
      );
    }
  }
}
