// src/attendance/attendance.controller.ts
import { AttendanceService } from './attendance.service';
import { Controller, Post, Param, Body, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@Body('token') token: string, @Res() res: Response) {
    const result = await this.attendanceService.checkIn(token);
    return res.status(result.statusCode).json(result);
  }
}
