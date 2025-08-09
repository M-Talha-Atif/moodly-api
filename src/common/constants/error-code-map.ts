import { HttpStatus } from '@nestjs/common';

export const ERROR_CODE_MAP: Record<string, number> = {
  // Booking creation errors
  NOT_FOUND: HttpStatus.NOT_FOUND,
  ALREADY_BOOKED: HttpStatus.CONFLICT,
  NO_AVAILABILITY: HttpStatus.CONFLICT,
  SERVER_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,

  // Booking cancellation errors
  NOT_OWNER: HttpStatus.FORBIDDEN,
  ALREADY_CANCELLED: HttpStatus.CONFLICT,
  CANCELLATION_WINDOW_PASSED: HttpStatus.BAD_REQUEST,
  EXPERIENCE_NOT_FOUND: HttpStatus.NOT_FOUND,
  EXPERIENCE_PAST: HttpStatus.BAD_REQUEST,
  NO_SPOTS_TO_RELEASE: HttpStatus.CONFLICT,
};
