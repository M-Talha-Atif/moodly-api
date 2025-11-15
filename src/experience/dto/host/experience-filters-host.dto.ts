import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';

export enum ExperienceSortBy {
  BOOKINGS = 'bookings',
  DATE = 'date',
}

export class HostExperienceFiltersDto {
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
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  cultureTags?: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value || value === 'all') return undefined;
    const array = Array.isArray(value) ? value : [value];
    // Filter out empty strings and 'all' values
    const filtered = array.filter(
      (item) => item && item.trim() !== '' && item !== 'all',
    );
    return filtered.length > 0 ? filtered : undefined;
  })
  desiredOutcomes?: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  targetEmotions?: string[];

  @IsOptional()
  @IsEnum(ExperienceSortBy)
  sortBy?: ExperienceSortBy;

  @IsOptional()
  @IsString()
  timeFilter?: string; // e.g. morning, afternoon, evening

  @IsOptional()
  @IsString()
  status?: 'past' | 'upcoming'; // for tab filtering

  @IsOptional()
  @Type(() => Number)
  minBookings?: number;

  @IsOptional()
  @Type(() => Number)
  maxBookings?: number;

  @IsOptional()
  @Type(() => Number)
  minSpots?: number;

  @IsOptional()
  @Type(() => Number)
  maxSpots?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
