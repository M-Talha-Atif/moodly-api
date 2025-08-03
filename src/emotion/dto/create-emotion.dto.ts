import {
  IsString,
  IsBooleanString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateEmotionDto {
  @IsString()
  emotion: string;

  @IsArray()
  @ArrayNotEmpty()
  goals: string[];

  @IsArray()
  @ArrayNotEmpty()
  activities: string[];

  @IsString()
  social: string;

  @IsBooleanString()
  community: string;
}
