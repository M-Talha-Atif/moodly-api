import { Injectable } from '@nestjs/common';
import { Booking } from 'src/booking/entities/booking.entity';
import { BookingResponseDto } from 'src/booking/dto/booking-response.dto';
import { BookingDetailDto } from 'src/booking/dto/booking-detail.dto';

@Injectable()
export class BookingMapperService {
  toResponseDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      status: booking.status,
      experience: {
        id: booking.experience.id,
        title: booking.experience.title,
        date: booking.experience.date.toISOString(), // convert to string
      },
      createdAt: booking.createdAt.toISOString(), // convert to string
    };
  }

  toDetailDto(booking: Booking): BookingDetailDto {
    return {
      bookingId: booking.id,
      experienceId: booking.experience.id,
      title: booking.experience.title,
      date: booking.experience.date?.toISOString() ?? '',
      time: booking.experience.date?.toISOString() ?? '',
      hostName: booking.experience.host?.name ?? 'Unknown Host',
      location: booking.experience.location,
      isVirtual: booking.experience.isVirtual,
      image: booking.experience.image,
      meetingLink: booking.experience.isVirtual
        ? booking.experience.meetingLink
        : undefined,
      qrCodeUrl: !booking.experience.isVirtual
        ? booking.attendance?.qrCodeUrl
        : undefined,
      attendees:
        booking.experience.bookings?.map((b) => ({
          userId: b.user?.id ?? 'unknown',
          name: b.user?.name ?? 'Unknown User',
          avatarUrl: b.user?.avatarUrl,
          status: b.attendance?.status,
        })) ?? [],
    };
  }
}
