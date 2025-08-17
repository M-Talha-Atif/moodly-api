// dto/create-mood-log-with-file.dto.ts
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateMoodLogWithFileDto {
  @IsOptional()
  @IsString()
  moodLabel?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  sameAsYesterday?: boolean;
}
