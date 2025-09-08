import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class ExperienceFiltersDto {
  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value, 10);
    return isNaN(val) ? 1 : val; // default to 1
  })
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value, 10);
    return isNaN(val) ? 10 : val; // default to 10
  })
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
