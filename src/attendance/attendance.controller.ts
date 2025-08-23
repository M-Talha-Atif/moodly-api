// src/attendance/attendance.controller.ts
import { AttendanceService } from './attendance.service';
import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';

/**
 * Controller responsible for handling attendance-related operations.
 * Provides endpoints for check-in actions and delegates business logic
 * to the AttendanceService.
 */
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * POST /attendance/check-in
   *
   * Allows a user to check in using a token (e.g., QR or JWT).
   * The token is validated by the service layer, and the attendance
   * record is updated accordingly.
   *
   * @param token - Token provided in the request body for authentication/validation.
   * @param res - Express Response object for returning structured JSON responses.
   *
   * @returns JSON response containing the result of the check-in operation,
   *          with HTTP status code set based on success or failure.
   */
  @Post('check-in')
  async checkIn(@Body('token') token: string, @Res() res: Response) {
    const result = await this.attendanceService.checkIn(token);
    return res.status(result.statusCode).json(result);
  }
}
