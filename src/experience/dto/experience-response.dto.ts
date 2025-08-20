import { Expose, Type } from 'class-transformer';

class HostResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  avatarUrl: string;
}

export class ExperienceResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  date: Date;

  @Expose()
  location: string;

  @Expose()
  image: string;

  @Expose()
  isVirtual: boolean;

  @Expose()
  sessionStartTime: Date;

  @Expose()
  sessionEndTime: Date;

  @Expose()
  isBooked: boolean;

  @Expose()
  bookingId?: string;

  @Expose()
  bookingStatus?: string;

  @Expose()
  price: number;

  @Expose()
  timezone: string;

  @Expose()
  totalSpots: number;

  @Expose()
  spotsFilled: number;

  @Expose()
  meetingLink?: string;

  @Expose()
  cancellationPolicy?: string;

  @Expose()
  aiPrep?: any;

  @Expose()
  testimonials?: any;

  @Expose()
  preparation?: any;

  @Expose()
  targetEmotions?: string[];

  @Expose()
  desiredOutcomes?: string[];

  @Expose()
  language?: string;

  @Expose()
  culturalTags?: string[];

  @Expose()
  growthDimensions?: any;

  @Expose()
  experienceOutcomeSummary?: string;

  @Expose()
  idealParticipantTraits?: string[];

  @Expose()
  engagementStats?: any;

  @Expose()
  @Type(() => HostResponseDto)
  host: HostResponseDto;
}
