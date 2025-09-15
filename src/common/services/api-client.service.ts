import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class ApiClientService {
  private readonly logger = new Logger(ApiClientService.name);
  private readonly baseUrl: string;
  private readonly hfToken: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('FASTAPI_URL') || 'http://localhost:8000';
    this.hfToken = this.configService.get<string>('HF_TOKEN') || '';
  }

  /**
   * Generic POST request for JSON payload
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      this.logger.debug(`POST request to ${url}`);
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${this.hfToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 35000,
      });
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      this.logger.error(`POST request failed: ${error.message}`, error.stack);
      throw new HttpException(
        error.response?.data || 'API request failed',
        error.response?.status || 500,
      );
    }
  }

  /**
   * Generic POST request for file uploads (FormData)
   */
  async postFile<T>(endpoint: string, filePath: string): Promise<T> {
    if (!fs.existsSync(filePath)) {
      throw new HttpException(`File not found: ${filePath}`, 404);
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      filename: filePath.split('/').pop(),
    });

    const url = `${this.baseUrl}${endpoint}`;

    try {
      this.logger.debug(`POST file to ${url}`);
      const res = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${this.hfToken}`,
        },
        timeout: 35000,
      });

      return res.data;
    } catch (err) {
      const error = err as AxiosError;

      // Log detailed error info
      this.logger.error(
        `File upload to ${url} failed`,
        error.stack,
        'ApiClientService',
      );

      if (error.response) {
        // Server responded with a status code outside 2xx
        throw new HttpException(
          error.response.data || 'File API request failed',
          error.response.status,
        );
      } else if (error.request) {
        // Request was made but no response received
        throw new HttpException('No response from API server', 503);
      } else {
        // Something else happened
        throw new HttpException(`Unexpected error: ${error.message}`, 500);
      }
    } finally {
      // Clean up temporary file safely
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          this.logger.verbose(`Cleaned up temporary file: ${filePath}`);
        }
      } catch (cleanupErr) {
        this.logger.warn(
          `Failed to clean up file ${filePath}: ${(cleanupErr as Error).message}`,
        );
      }
    }
  }
}
