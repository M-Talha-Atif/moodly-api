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
  // TEMPORARY FIX: Allow multiple audio formats
  validateVoiceFile(file: Express.Multer.File): ResultDto<void> {
    if (!file) return ResultDto.okEmpty();

    console.log('🔊 Voice file validation (TEMPORARY):', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // TEMPORARY: Allow common audio formats
    const allowedMimeTypes = [
      'audio/wav',
      'audio/x-wav',
      'audio/m4a',
      'audio/mp4',
      'audio/aac',
    ];
    const allowedExtensions = ['.wav', '.m4a', '.aac', '.mp4'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (
      !allowedMimeTypes.includes(file.mimetype) ||
      !allowedExtensions.includes(ext)
    ) {
      console.log('❌ Unsupported audio format:', file.mimetype, ext);
      return ResultDto.fail(
        'Supported formats: WAV, M4A, AAC, MP4',
        400,
        'INVALID_VOICE_FORMAT',
      );
    }

    console.log('✅ Voice file validation passed');
    return ResultDto.okEmpty();
  }
  // validateVoiceFile(file: Express.Multer.File): ResultDto<void> {
  //   if (!file) return ResultDto.okEmpty();

  //   // Check MIME type first (faster than reading file)
  //   if (!file.mimetype.includes('wav') && !file.mimetype.includes('wave')) {
  //     console.log("File type issue")
  //     return ResultDto.fail(
  //       'Only WAV format is supported for voice recordings',
  //       400,
  //       'INVALID_VOICE_FORMAT',
  //     );
  //   }

  //   // Check file extension
  //   const ext = path.extname(file.originalname).toLowerCase();
  //   if (ext !== '.wav') {
  //     return ResultDto.fail(
  //       'File must have .wav extension',
  //       400,
  //       'INVALID_VOICE_FORMAT',
  //     );
  //   }

  //   return ResultDto.okEmpty();
  // }

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
