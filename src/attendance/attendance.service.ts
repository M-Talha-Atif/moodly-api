// src/attendance/attendance.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { generateJoinToken, generateQRCode } from './utils/join-code.util';
import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { NotificationService } from '../notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { CheckInResponseDto } from './dto/check-in-response.dto';
import { CreateAttendanceResponseDto } from './dto/create-attendance-response.dto';

/**
 * AttendanceService
 *
 * Handles the full attendance lifecycle:
 * - On booking confirmation → creates attendance records with join codes, JWTs, and QR codes.
 * - Sends attendance QR codes via email notifications.
 * - On check-in → verifies tokens, validates session time, and marks attendance as "present".
 */
@Injectable()
export class AttendanceService {
  private readonly jwtSecret: string;

  /**
   * Constructor initializes repository and dependencies.
   * Also validates that a JWT secret is provided via environment variables.
   */
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {
    const secret = this.configService.get<string>('ATTENDANCE_JWT_SECRET');
    if (!secret) {
      throw new Error(
        'ATTENDANCE_JWT_SECRET is not set in environment variables',
      );
    }
    this.jwtSecret = secret;
  }

  /**
   * Creates an attendance record for a booking.
   *
   * Flow:
   * 1. Generate a join code + JWT token.
   * 2. Create a QR code from the token.
   * 3. Persist attendance record in DB.
   * 4. Send QR code to user via email notification.
   *
   * @param user - The user making the booking.
   * @param bookingId - The booking ID associated with this attendance.
   * @param experience - The experience details (contains session info).
   * @returns {CreateAttendanceResponseDto} Success response with attendance and token.
   */
  async createAttendance(
    user: any,
    bookingId: string,
    experience: any,
  ): Promise<CreateAttendanceResponseDto> {
    const joinCode = randomBytes(4).toString('hex');
    const token = generateJoinToken(
      joinCode,
      user.id,
      experience.id,
      experience.sessionEndTime,
      this.jwtSecret,
    );
    const qrImage = await generateQRCode(token);

    const attendance = this.attendanceRepo.create({
      bookingId,
      userId: user.id,
      experienceId: experience.id,
      joinCode,
      method: experience.isVirtual ? 'virtual' : 'in_person',
    });
    await this.attendanceRepo.save(attendance);

    await this.notificationService.sendEmail({
      userId: user.id,
      email: user.email,
      subject: `Your QR Code for ${experience.title}`,
      text: 'Scan this QR code at check-in',
      html: `<p>Scan this at check-in:</p><img src="${qrImage}" />`,
      qrCodeData: token,
    });

    return new CreateAttendanceResponseDto({
      success: true,
      message: 'Attendance created successfully',
      attendance,
      token,
    });
  }

  /**
   * Verifies and processes user check-in.
   *
   * Flow:
   * 1. Validate provided JWT token.
   * 2. Locate corresponding attendance by joinCode.
   * 3. Ensure check-in occurs within allowed time window:
   *    - Not earlier than 1 hour before session start.
   *    - Not after session end.
   * 4. Mark attendance as "present" and set check-in timestamp.
   *
   * @param token - The JWT token from QR code or client app.
   * @returns {CheckInResponseDto} Success response with attendance, or error response.
   */
  async checkIn(token: string): Promise<CheckInResponseDto> {
    let payload: any;
    try {
      payload = jwt.verify(token, this.jwtSecret);
    } catch {
      return CheckInResponseDto.error('Invalid or expired QR code', 401);
    }

    const attendance = await this.attendanceRepo.findOne({
      where: { joinCode: payload.joinCode },
      relations: ['experience'],
    });
    if (!attendance) {
      return CheckInResponseDto.error('Invalid join code', 404);
    }

    const now = new Date();
    const sessionStart = new Date(attendance.experience.sessionStartTime);
    const sessionEnd = new Date(attendance.experience.sessionEndTime);
    const allowedStart = new Date(sessionStart.getTime() - 60 * 60 * 1000); // 1 hour before start

    if (now < allowedStart)
      return CheckInResponseDto.error('Too early for check-in', 400);
    if (now > sessionEnd)
      return CheckInResponseDto.error('Session already ended', 400);

    attendance.status = 'present';
    attendance.checkInTime = now;
    await this.attendanceRepo.save(attendance);

    return CheckInResponseDto.success(attendance);
  }

  /**
   * Deletes attendance records associated with a specific booking.
   *
   * @param bookingId - The booking ID to delete attendance records for.
   */
  async deleteByBookingId(bookingId: string) {
    await this.attendanceRepo.delete({ bookingId });
  }
}
