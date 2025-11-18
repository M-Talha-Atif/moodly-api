// storage.service.ts
import { Injectable } from '@nestjs/common';
import { join } from 'path';
// import { promises as fs } from 'fs';
import { S3Service } from 'src/common/services/s3.service';

@Injectable()
export class StorageService {
  constructor(private readonly s3: S3Service) {}

  private baseUploadDir = join(process.cwd(), 'uploads');

  async save(
    file: Express.Multer.File,
    type: 'photo' | 'voice',
  ): Promise<string> {
    // const ext = file.originalname.split('.').pop();
    // const key = `${type}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    console.log(type);

    const url = await this.s3.uploadBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return url; // public URL
  }

  async deleteFromS3(url: string) {
    if (!url) return;

    const key = url.replace(process.env.S3_BASE_URL + '/', '');
    await this.s3.deleteObject(key);
  }

  // optional: map to public URL
  getPublicUrl(filePath: string): string {
    return filePath.replace(this.baseUploadDir, '/uploads');
  }
}
