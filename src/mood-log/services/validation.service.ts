import { Injectable } from '@nestjs/common';
import { ResultDto } from 'src/common/dto/result.dto';
import { CreateMoodLogDto } from '../dto/create-mood-log.dto';
import * as fs from 'fs';
import * as path from 'path';

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

    console.log('Voice file validation:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Comprehensive list of audio MIME types
    const allowedMimeTypes = [
      'audio/wav',
      'audio/x-wav',
      'audio/wave',
      'audio/mpeg',
      'audio/mp3',
      'audio/mp4',
      'audio/m4a',
      'audio/aac',
      'audio/x-m4a',
      'audio/ogg',
      'audio/webm',
      'audio/flac',
      'audio/x-flac',
    ];

    // Supported file extensions
    const allowedExtensions = [
      '.wav',
      '.wave',
      '.mp3',
      '.mpeg',
      '.m4a',
      '.mp4',
      '.aac',
      '.ogg',
      '.oga',
      '.webm',
      '.flac',
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    // Check if MIME type OR extension is allowed (more flexible)
    const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
    const isExtensionValid = allowedExtensions.includes(ext);

    if (!isMimeTypeValid || !isExtensionValid) {
      console.log('Unsupported audio format:', {
        mimetype: file.mimetype,
        extension: ext,
        allowedMimeTypes,
        allowedExtensions,
      });

      return ResultDto.fail(
        `Unsupported audio format. Supported: ${allowedExtensions.join(', ')}`,
        400,
        'INVALID_VOICE_FORMAT',
      );
    }

    console.log(' Voice file validation passed');
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
      console.log(error);
      return ResultDto.fail(
        'Error validating voice file',
        500,
        'FILE_VALIDATION_ERROR',
      );
    }
  }
}
