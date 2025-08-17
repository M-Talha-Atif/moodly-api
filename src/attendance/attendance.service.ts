// src/attendance/attendance.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
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

/* 
When booking is confirmed → createAttendance() runs.

Generates joinCode + JWT token.

Creates QR code from token → sends email to user.

At check-in → host scans QR code → sends token to /attendance/check-in.

Token verified → attendance marked as present.
*/
@Injectable()
export class AttendanceService {
  private readonly jwtSecret: string;
  // jwtSecret is injected from ConfigService to allow for dynamic configuration
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    private notificationService: NotificationService,
    private configService: ConfigService, // inject ConfigService
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
   * Creates an attendance record for a user booking an experience.
   * Generates a join code and JWT token, creates a QR code, and sends it via email.
   * @param user - The user who booked the experience
   * @param bookingId - The ID of the booking
   * @param experience - The experience details
   * @returns CreateAttendanceResponseDto with success status and attendance details
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

    console.log(
      `Generated QR code for user ${user.id} for experience ${experience.id}`,
    );
    console.log(`Join code: ${joinCode}`);
    console.log(`JWT token: ${token}`);

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
   * Checks in a user based on the provided JWT token.
   * Validates the token, checks the attendance status, and updates it to 'present'.
   * @param token - The JWT token containing the join code
   * @returns CheckInResponseDto with success status and attendance details or error message
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
    const allowedStart = new Date(sessionStart.getTime() - 60 * 60 * 1000);

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
   * Deletes attendance records by booking ID.
   * @param bookingId - The ID of the booking to delete attendance records for
   */
  async deleteByBookingId(bookingId: string) {
    await this.attendanceRepo.delete({ bookingId });
  }
}
