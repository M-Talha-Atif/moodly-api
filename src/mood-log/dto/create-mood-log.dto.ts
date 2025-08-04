import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMoodLogDto {
  @IsOptional()
  @IsString()
  moodLabel?: string;


  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  textSentiment?: string;

  @IsOptional()
  @IsString()
  photoEmotion?: string;

  @IsOptional()
  @IsString()
  voiceTranscript?: string;

  @IsOptional()
  @IsString()
  voiceSentiment?: string;

  @IsOptional()
  @IsBoolean()
  sameAsYesterday?: boolean;
}
