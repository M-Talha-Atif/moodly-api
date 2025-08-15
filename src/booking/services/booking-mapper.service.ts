import { Injectable } from '@nestjs/common';
import { Booking } from '../entities/booking.entity';
import { BookingResponseDto } from '../dto/booking-response.dto';

@Injectable()
export class BookingMapperService {
  toResponseDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      status: booking.status,
      experience: {
        id: booking.experience.id,
        title: booking.experience.title,
        date: booking.experience.date,
      },
      createdAt: booking.createdAt,
    };
  }
}
