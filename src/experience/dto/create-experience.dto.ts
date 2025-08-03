import { IsString, IsDateString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  location: string;
}
