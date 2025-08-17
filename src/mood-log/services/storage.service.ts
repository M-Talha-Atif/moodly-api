// storage.service.ts
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class StorageService {
    private baseUploadDir = join(process.cwd(), 'uploads');

    async save(file: Express.Multer.File, type: 'photo' | 'voice'): Promise<string> {
        const uploadDir = join(this.baseUploadDir, type);
        await fs.mkdir(uploadDir, { recursive: true });

        // multer already stored file on disk, so just move/rename it
        const targetPath = join(uploadDir, file.originalname);
        await fs.rename(file.path, targetPath);

        return targetPath;
    }


    async delete(filePath: string): Promise<void> {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.warn(`⚠️ Failed to delete file ${filePath}`, err.message);
        }
    }

    // optional: map to public URL
    getPublicUrl(filePath: string): string {
        return filePath.replace(this.baseUploadDir, '/uploads');
    }
}
