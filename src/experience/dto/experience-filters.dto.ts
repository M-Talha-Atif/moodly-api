import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class ExperienceFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString({ each: true })
  cultureTags?: string[];

  @IsOptional()
  @IsString({ each: true })
  desiredOutcomes?: string[];

  @IsOptional()
  @IsString({ each: true })
  targetEmotions?: string[];

  @IsOptional()
  @IsString()
  timeFilter?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
