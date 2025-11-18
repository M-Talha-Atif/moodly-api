// src/common/services/file-download.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { S3Service } from './s3.service';

@Injectable()
export class FileDownloadService {
  private readonly logger = new Logger(FileDownloadService.name);
  private readonly tempDir = './uploads/temp';

  constructor(private readonly s3Service: S3Service) {
    // Ensure temp directory exists
    fs.mkdirSync(this.tempDir, { recursive: true });
  }

  /**
   * Download file from S3 URL to temporary local file
   */
  async downloadFromS3Url(s3Url: string): Promise<string> {
    try {
      const key = this.s3Service.extractKeyFromUrl(s3Url);
      const buffer = await this.s3Service.downloadBuffer(key);

      const fileExt = path.extname(key) || '.tmp';
      const tempFileName = `temp-${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`;
      const tempFilePath = path.join(this.tempDir, tempFileName);

      await fs.promises.writeFile(tempFilePath, buffer);
      this.logger.debug(`Downloaded S3 file to: ${tempFilePath}`);

      return tempFilePath;
    } catch (error) {
      this.logger.error(`Failed to download from S3 URL: ${s3Url}`, error);
      throw new Error(`File download failed: ${error.message}`);
    }
  }

  /**
   * Clean up temporary file
   */
  async cleanupTempFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        this.logger.debug(`Cleaned up temp file: ${filePath}`);
      }
    } catch (error) {
      this.logger.warn(
        `Failed to cleanup temp file ${filePath}: ${error.message}`,
      );
    }
  }
}
