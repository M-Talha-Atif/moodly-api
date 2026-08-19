// src/attendance/attendance.controller.ts
import { AttendanceService } from './attendance.service';
import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Response } from 'express';

/**
 * Controller responsible for managing attendance-related operations.
 * Handles incoming requests and delegates business logic to the
 * AttendanceService.
 *
 * No JWT guard here by design: the signed join-code/QR token passed in the body
 * is itself the credential (see ATTENDANCE_JWT_SECRET), like a ticket scan.
 * ThrottlerGuard still applies since that token can otherwise be brute-forced
 * or replayed with no rate limit at all.
 */
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * Handles user check-in requests.
   *
   * Endpoint: POST /attendance/check-in
   *
   * Validates the provided token (e.g., QR code, JWT) and updates
   * the attendance record accordingly.
   *
   * @param token - Authentication/validation token provided in the request body.
   * @param res - Express Response object used to return structured JSON responses.
   * @returns JSON object with the check-in result and corresponding HTTP status code.
   */
  @UseGuards(ThrottlerGuard)
  @Post('check-in')
  async checkIn(@Body('token') token: string, @Res() res: Response) {
    const result = await this.attendanceService.checkIn(token);
    return res.status(result.statusCode).json(result);
  }
}
