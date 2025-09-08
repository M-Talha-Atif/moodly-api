// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';

@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class CommonModule {}
