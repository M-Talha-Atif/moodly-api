// validation.service.ts
import { Injectable } from '@nestjs/common';
import { ResultDto } from 'src/common/dto/result.dto';
import { CreateMoodLogDto } from '../dto/create-mood-log.dto';
import * as fs from 'fs';

@Injectable()
export class ValidationService {
  /**
   * Validates that at least one input type is provided
   * @param dto CreateMoodLogDto containing user inputs
   * @returns ResultDto with validation status
   */
  validateInputs(dto: CreateMoodLogDto): ResultDto<void> {
    // Check if at least one input is provided
    if (!dto.photoPath && !dto.voicePath && !dto.note && !dto.moodLabel) {
      return ResultDto.fail(
        'At least one input (photo, voice, note, or mood label) is required',
        400,
        'INPUT_REQUIRED',
      );
    }
    return ResultDto.okEmpty();
  }

  /**
   * Validates voice file format and existence
   * @param filePath Path to the voice file
   * @returns ResultDto with validation status
   */
  validateVoiceFile(filePath: string): ResultDto<void> {
    if (!filePath) {
      return ResultDto.okEmpty(); // No voice file is acceptable
    }

    // Check file existence
    if (!fs.existsSync(filePath)) {
      return ResultDto.fail('Voice file not found', 404, 'FILE_NOT_FOUND');
    }

    // Check file extension
    if (!filePath.toLowerCase().endsWith('.wav')) {
      return ResultDto.fail(
        'Only WAV format is supported for voice recordings',
        400,
        'INVALID_VOICE_FORMAT',
      );
    }

    return ResultDto.okEmpty();
  }
}
