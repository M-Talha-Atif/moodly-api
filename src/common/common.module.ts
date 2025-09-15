// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { ApiClientService } from 'src/common/services/api-client.service';

@Module({
  providers: [S3Service, ApiClientService],
  exports: [S3Service, ApiClientService],
})
export class CommonModule {}
