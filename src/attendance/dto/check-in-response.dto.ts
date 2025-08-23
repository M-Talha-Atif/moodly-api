import { ApiProperty } from '@nestjs/swagger';
import { ResultDto } from '../../common/dto/result.dto';
import { Attendance } from '../entities/attendance.entity';

/**
 * DTO representing the response structure for check-in operations.
 * Extends the generic ResultDto to include additional attendance-specific data.
 */
export class CheckInResponseDto extends ResultDto<Attendance> {
  /**
   * The attendance entity returned upon a successful check-in.
   * This property is optional and only present in case of success.
   */
  @ApiProperty({ type: Attendance, required: false })
  attendance?: Attendance;

  /**
   * Initializes the DTO using partial data.
   * Useful for constructing flexible response objects.
   * 
   * @param partial - Partial properties to assign to the DTO.
   */
  constructor(partial: Partial<CheckInResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  /**
   * Factory method to create a successful check-in response.
   * 
   * @param attendance - The attendance record created during check-in.
   * @returns {CheckInResponseDto} A response DTO with success state and attendance data.
   */
  static success(attendance: Attendance): CheckInResponseDto {
    return new CheckInResponseDto({
      ...ResultDto.ok(attendance, 'Check-in successful'),
      attendance,
    });
  }

  /**
   * Factory method to create an error response for failed check-in attempts.
   * 
   * @param reason - Description of the failure reason.
   * @param statusCode - Optional HTTP status code (default: 400).
   * @returns {CheckInResponseDto} A response DTO with error details.
   */
  static error(reason: string, statusCode = 400): CheckInResponseDto {
    return new CheckInResponseDto({
      ...ResultDto.fail(reason, statusCode),
    });
  }
}
