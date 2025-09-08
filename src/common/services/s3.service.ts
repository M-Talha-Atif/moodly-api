// src/common/s3.service.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly logger = new Logger(S3Service.name);

  constructor() {
    this.region = process.env.AWS_REGION!;
    this.bucket = process.env.S3_BUCKET!;

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  /** Upload file buffer to S3 and return public URL */
  async uploadBuffer(
    buffer: Buffer,
    originalName: string,
    mimetype: string,
  ): Promise<string> {
    const ext = originalName?.split('.').pop() || mimetype.split('/').pop();
    const key = `experiences/${uuidv4()}.${ext}`;

    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });

    await this.s3.send(cmd);
    this.logger.log(`File uploaded to S3: ${key}`);

    return `${process.env.S3_BASE_URL}/${key}`;
  }

  /** Generate presigned URL for client direct upload */
  async getPresignedUploadUrl(
    originalName: string,
    mimetype: string,
    expiresInSeconds = 300,
  ): Promise<{ url: string; key: string }> {
    const ext = originalName?.split('.').pop() || mimetype.split('/').pop();
    const key = `experiences/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimetype,
    });

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: expiresInSeconds,
    });
    this.logger.log(`Generated presigned URL for key: ${key}`);

    return { url, key };
  }

  /** Delete an object from S3 by key */
  async deleteObject(key: string): Promise<void> {
    if (!key) return;
    try {
      const cmd = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
      await this.s3.send(cmd);
      this.logger.log(`File deleted from S3: ${key}`);
    } catch (err) {
      this.logger.error(`Failed to delete file from S3: ${key}`, err);
    }
  }
}
