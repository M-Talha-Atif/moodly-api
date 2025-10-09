import { Expose } from 'class-transformer';

export class RecommendationResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  image: string;

  @Expose()
  price: number;

  @Expose()
  targetEmotion: string;
}
