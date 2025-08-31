import { IsString, IsOptional } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;
}
