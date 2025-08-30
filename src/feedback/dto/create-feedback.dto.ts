import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    example: 'The app is very helpful and easy to use!',
    description: 'User feedback or comment',
  })
  @IsString()
  comment: string;

  @ApiProperty({
    example: 5,
    description: 'Rating given by the user (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
