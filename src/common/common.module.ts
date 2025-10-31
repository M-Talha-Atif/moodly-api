// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { ApiClientService } from 'src/common/services/api-client.service';
import { GeminiService } from './services/gemini.service';

@Module({
  providers: [S3Service, ApiClientService, GeminiService],
  exports: [S3Service, ApiClientService, GeminiService],
})
export class CommonModule {}
