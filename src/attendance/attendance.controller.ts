// src/attendance/attendance.controller.ts
import { AttendanceService } from './attendance.service';
import { Controller, Post, Param, Body, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

// AttendanceController handles attendance-related operations
// such as checking in users based on a token.
// It uses the AttendanceService to perform the actual logic.
// The checkIn method expects a token in the request body and returns a response
// with the result of the check-in operation.
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Endpoint to check in a user using a token
  // Expects a POST request with a JSON body containing the token
  // Returns a JSON response with the result of the check-in operation
  // The response status code is set based on the result of the operation
  @Post('check-in')
  async checkIn(@Body('token') token: string, @Res() res: Response) {
    const result = await this.attendanceService.checkIn(token);
    return res.status(result.statusCode).json(result);
  }
}
