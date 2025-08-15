import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Experience } from '../../experience/entities/experience.entity';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingResponseDto } from '../dto/booking-response.dto';
import { ResultDto } from '../../common/dto/result.dto';
import { ERROR_CODE_MAP } from '../../common/constants/error-code-map';
import { TransactionService } from '../../common/services/transaction.service';
import { BookingValidationService } from './booking-validation.service';
import { BookingSideEffectsService } from './booking-side-effects.service';
import { BookingMapperService } from './booking-mapper.service';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@Injectable()
export class BookingCreationService {
  private readonly logger = new Logger(BookingCreationService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    private readonly transactionService: TransactionService,
    private readonly validationService: BookingValidationService,
    private readonly sideEffectsService: BookingSideEffectsService,
    private readonly mapperService: BookingMapperService,
  ) {}

  async createBooking(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<ResultDto<BookingResponseDto>> {
    const savedBooking = await this.transactionService.withTransaction(
      async (manager) => {
        const bookingResult = await this.tryCreateOrRestoreBooking(
          manager,
          dto.experienceId,
          userId,
        );

        if (bookingResult.length === 0) {
          await this.handleNoBookingCreated(manager, dto.experienceId, userId);
        }

        const bookingId = bookingResult[0].id;
        return manager.findOneOrFail(Booking, {
          where: { id: bookingId },
          relations: ['experience', 'user'],
        });
      },
    );

    // Trigger side effects after commit
    this.sideEffectsService.queueBookingCreatedSideEffects(
      savedBooking,
      userId,
    );

    return ResultDto.ok(
      this.mapperService.toResponseDto(savedBooking),
      'Booking created successfully',
      ERROR_CODE_MAP.CREATED,
    );
  }

  /**
   * Attempts to insert a new booking or restore a cancelled one.
   * Updates spots if booking is successful.
   */
  private async tryCreateOrRestoreBooking(
    manager: EntityManager,
    experienceId: string,
    userId: string,
  ) {
    return manager.query(
      `
    WITH selected_experience AS (
      SELECT e.*
      FROM "experience" e
      WHERE e.id = $1
      FOR UPDATE
    ),
    check_existing AS (
      SELECT b.*
      FROM "booking" b
      WHERE b."userId" = $2
        AND b."experienceId" = $1
      ORDER BY b."createdAt" DESC
      LIMIT 1
    ),
    action AS (
      UPDATE "booking" b
      SET status = 'confirmed', "cancelledAt" = NULL
      FROM check_existing ce
      WHERE b.id = ce.id AND ce.status = 'cancelled'
      RETURNING b.*
    ),
    insert_new AS (
      INSERT INTO "booking" ("experienceId", "userId", status, "createdAt")
      SELECT $1, $2, 'confirmed', now()
      FROM selected_experience se
      WHERE NOT EXISTS (SELECT 1 FROM check_existing ce WHERE ce.id IS NOT NULL)
        AND se."spotsFilled" < se."totalSpots"
      RETURNING *
    ),
    update_spots AS (
      UPDATE "experience" e
      SET "spotsFilled" = e."spotsFilled" + 1
      FROM selected_experience se
      WHERE e.id = se.id
        AND (EXISTS (SELECT 1 FROM insert_new) OR EXISTS (SELECT 1 FROM action))
      RETURNING e.*
    )
    SELECT * FROM insert_new
    UNION ALL
    SELECT * FROM action;
    `,
      [experienceId, userId],
    );
  }

  /**
   * Handles the scenario where no booking was created.
   * Throws appropriate exceptions based on current state.
   */
  private async handleNoBookingCreated(
    manager: EntityManager,
    experienceId: string,
    userId: string,
  ) {
    const [check] = await manager.query(
      `
    WITH selected_experience AS (
      SELECT e."id", e."spotsFilled", e."totalSpots"
      FROM "experience" e
      WHERE e."id" = $1
      FOR UPDATE
    ),
    check_existing AS (
      SELECT b."status", b."createdAt"
      FROM "booking" b
      WHERE b."userId" = $2
        AND b."experienceId" = $1
      ORDER BY b."createdAt" DESC
      LIMIT 1
    )
    SELECT 
      ce."status" AS "bookingStatus",
      se."spotsFilled",
      se."totalSpots"
    FROM selected_experience se
    LEFT JOIN check_existing ce ON TRUE;
    `,
      [experienceId, userId],
    );

    if (check?.bookingStatus === 'confirmed') {
      throw new ConflictException('You already booked this experience');
    }
    if (check?.spotsFilled >= check?.totalSpots) {
      throw new BadRequestException('No available spots');
    }

    throw new NotFoundException('Experience not found');
  }
}
