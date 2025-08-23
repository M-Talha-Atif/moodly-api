import { ApiProperty } from '@nestjs/swagger';
import { ResultDto } from '../../common/dto/result.dto';
import { Attendance } from '../entities/attendance.entity';

/**
 * DTO representing the response structure after creating a new attendance record.
 * Extends ResultDto to include both the created attendance entity and a generated token.
 */
export class CreateAttendanceResponseDto extends ResultDto<{
  attendance: Attendance;
  token: string;
}> {
  /**
   * The newly created attendance entity.
   */
  @ApiProperty({ type: Attendance })
  attendance: Attendance;

  /**
   * A generated token (e.g., JWT or QR-based token) associated with the attendance.
   * Typically used for subsequent validation or quick check-ins.
   */
  @ApiProperty({ example: 'jwt.qr.token' })
  token: string;

  /**
   * Initializes the DTO using partial data.
   * 
   * @param partial - Partial properties to assign to the DTO.
   */
  constructor(partial: Partial<CreateAttendanceResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
