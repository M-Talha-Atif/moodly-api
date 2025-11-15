import { Expose, Transform } from 'class-transformer';

export class HostExperienceListItemDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  date: string;

  @Expose()
  image: string;

  @Expose()
  totalSpots: number;

  @Expose()
  status: 'past' | 'upcoming';

  @Expose()
  totalBookings: number;
}
