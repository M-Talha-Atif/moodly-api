import { Injectable } from '@nestjs/common';
import { ResultDto } from 'src/common/dto/result.dto';
import { CreateMoodLogDto } from '../dto/create-mood-log.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';

@Injectable()
export class ValidationService {
  /**
   * Validates that at least one input type is provided
   */
  validateInputs(
    dto: CreateMoodLogDto,
    files?: { photo?: Express.Multer.File; voice?: Express.Multer.File },
  ): ResultDto<void> {
    console.log(files?.photo);
    console.log(dto.photoPath);
    console.log(dto.voicePath);
    const hasPhoto = !!files?.photo || !!dto.photoPath;
    const hasVoice = !!files?.voice || !!dto.voicePath;
    console.log(hasPhoto);
    console.log(hasVoice);

    if (!hasPhoto && !hasVoice) {
      return ResultDto.fail(
        'At least one of voice recording or photo is required',
        400,
        'VOICE_OR_PHOTO_REQUIRED',
      );
    }

    return ResultDto.okEmpty();
  }

  /**
   * Validates voice file before saving
   */
  validateVoiceFile(file: Express.Multer.File): ResultDto<void> {
    if (!file) return ResultDto.okEmpty();

    // Check MIME type first (faster than reading file)
    if (!file.mimetype.includes('wav') && !file.mimetype.includes('wave')) {
      return ResultDto.fail(
        'Only WAV format is supported for voice recordings',
        400,
        'INVALID_VOICE_FORMAT',
      );
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.wav') {
      return ResultDto.fail(
        'File must have .wav extension',
        400,
        'INVALID_VOICE_FORMAT',
      );
    }

    return ResultDto.okEmpty();
  }

  /**
   * Validates existing voice file path
   */
  validateExistingVoiceFile(filePath: string): ResultDto<void> {
    if (!filePath) return ResultDto.okEmpty();

    try {
      // Check file exists
      if (!fs.existsSync(filePath)) {
        return ResultDto.fail('Voice file not found', 404, 'FILE_NOT_FOUND');
      }

      // Check extension
      if (!filePath.toLowerCase().endsWith('.wav')) {
        return ResultDto.fail(
          'Only WAV format is supported',
          400,
          'INVALID_VOICE_FORMAT',
        );
      }

      return ResultDto.okEmpty();
    } catch (error) {
      return ResultDto.fail(
        'Error validating voice file',
        500,
        'FILE_VALIDATION_ERROR',
      );
    }
  }
}
