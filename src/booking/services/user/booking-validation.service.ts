import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Experience } from 'src/experience/entities/experience.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Injectable()
export class BookingValidationService {
  async validateExperienceExists(
    manager: EntityManager,
    experienceId: string,
  ): Promise<void> {
    const exists = await manager.exists(Experience, {
      where: { id: experienceId },
    });

    if (!exists) {
      throw new NotFoundException('Experience not found');
    }
  }

  validateBookingAllowed(
    existingBooking: Booking | null,
    experience: Experience,
  ): void {
    if (existingBooking?.status === 'confirmed') {
      throw new ConflictException('You already booked this experience');
    }

    if (experience.spotsFilled >= experience.totalSpots) {
      throw new BadRequestException('No available spots');
    }
  }

  validateCancellationAllowed(
    booking: Booking,
    experience: Experience,
    now: Date,
  ): void {
    if (booking.status === 'cancelled') {
      throw new ConflictException('Booking is already cancelled');
    }

    const experienceDate = new Date(experience.date);
    if (experienceDate < now) {
      throw new BadRequestException('Cannot cancel past experiences');
    }

    const cancellationDeadline = new Date(experienceDate);
    cancellationDeadline.setHours(cancellationDeadline.getHours() - 24);

    if (now > cancellationDeadline) {
      throw new BadRequestException(
        'Cancellations must be at least 24 hours before start',
      );
    }

    if (experience.spotsFilled <= 0) {
      throw new BadRequestException('No spots to release');
    }
  }
}
