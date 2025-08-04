import {
  IsString,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsArray,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  location: string;

  @IsString()
  image: string;

  @IsBoolean()
  isVirtual: boolean;

  @IsDateString()
  sessionStartTime: string;

  @IsDateString()
  sessionEndTime: string;

  @IsNumber()
  price: number;

  @IsString()
  timezone: string;

  @IsNumber()
  totalSpots: number;

  @IsOptional()
  @IsNumber()
  spotsFilled?: number;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @IsOptional()
  @IsObject()
  aiPrep?: any;

  @IsOptional()
  @IsObject()
  testimonials?: any;

  @IsOptional()
  @IsObject()
  preparation?: any;

  @IsOptional()
  @IsArray()
  targetEmotions?: string[];

  @IsOptional()
  @IsArray()
  desiredOutcomes?: string[];

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  culturalTags?: string[];

  @IsOptional()
  @IsObject()
  growthDimensions?: any;

  @IsOptional()
  @IsString()
  experienceOutcomeSummary?: string;

  @IsOptional()
  @IsArray()
  idealParticipantTraits?: string[];

  @IsOptional()
  @IsObject()
  engagementStats?: any;
}
