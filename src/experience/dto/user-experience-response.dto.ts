import { Expose } from 'class-transformer';

export class ExperienceResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  price: number;

  @Expose()
  image: string;
}
