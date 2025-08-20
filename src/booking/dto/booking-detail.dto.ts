// src/booking/dto/booking-detail.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AttendeeDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty({ enum: ['pending', 'present', 'absent'], required: false })
  status?: 'pending' | 'present' | 'absent';
}

export class BookingDetailDto {
  @ApiProperty()
  bookingId: string;

  @ApiProperty()
  experienceId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  date: string; // ISO string

  @ApiProperty()
  time: string; // could also be Date if you prefer

  @ApiProperty()
  hostName: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  isVirtual: boolean;

  @ApiProperty({ required: false })
  meetingLink?: string;

  @ApiProperty({ required: false })
  qrCodeUrl?: string;

  @ApiProperty({ type: [AttendeeDto], required: false })
  attendees?: AttendeeDto[];
}
