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

    try {
      const url = `${this.baseUrl}${endpoint}`;
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
      this.logger.error(`File upload failed: ${error.message}`, error.stack);
      throw new HttpException(
        error.response?.data || 'File API request failed',
        error.response?.status || 500,
      );
    } finally {
      try {
        fs.unlinkSync(filePath);
      } catch {}
    }
  }
}
