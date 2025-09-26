import { Expose, Transform } from 'class-transformer';

export class ExperienceListItemDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  date: string; // <-- now always a string (ISO format)

  @Expose()
  location: string;

  @Expose()
  image: string;

  @Expose()
  price: number;

  @Expose()
  isVirtual: boolean;

  @Expose()
  spotsFilled: number;

  @Expose()
  totalSpots: number;

  @Expose()
  @Transform(({ value }) => value ?? [])
  culturalTags: string[];

  @Expose()
  @Transform(({ value }) => value ?? [])
  targetEmotions: string[];

  @Expose()
  @Transform(({ value }) => value ?? [])
  desiredOutcomes: string[];

  @Expose()
  isBooked: boolean;

  @Expose()
  bookingId?: string;

  @Expose()
  bookingStatus?: string;

  @Expose()
  @Transform(({ obj }) => ({
    id: obj.host?.id,
    name: obj.host?.name,
    avatar: obj.host?.avatar,
  }))
  host: {
    id: string;
    name: string;
    avatar?: string;
  };
}
