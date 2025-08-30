// src/emotion/dto/onboarding.dto.ts
import { IsString, IsArray } from 'class-validator';

export class AnswerQuestionDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;
}

export class SetGoalsDto {
  @IsArray()
  goals: string[];
}

export class SetActivitiesDto {
  @IsArray()
  activities: string[];
}
