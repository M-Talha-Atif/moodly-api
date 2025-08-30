import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateMoodLogDto {
  @ApiProperty({ example: 'happy', description: 'Label of the detected mood' })
  @IsString()
  moodLabel: string;

  @ApiProperty({ example: 'Had a good day', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: 'positive', required: false })
  @IsOptional()
  @IsString()
  textSentiment?: string;

  @ApiProperty({
    example: '/tmp/photo.jpg',
    required: false,
    description: 'Path to uploaded photo file',
  })
  @IsOptional()
  @IsString()
  photoPath?: string;

  @ApiProperty({
    example: '/tmp/voice.wav',
    required: false,
    description: 'Path to uploaded audio file',
  })
  @IsOptional()
  @IsString()
  voicePath?: string;

  @ApiProperty({
    example: 'joy',
    required: false,
    description: 'Emotion detected from the photo',
  })
  @IsOptional()
  @IsString()
  photoEmotion?: string;

  @ApiProperty({
    example: 'calm',
    required: false,
    description: 'Sentiment detected from the voice',
  })
  @IsOptional()
  @IsString()
  voiceSentiment?: string;
}
