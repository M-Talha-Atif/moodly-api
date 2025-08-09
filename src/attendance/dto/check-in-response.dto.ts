import { ApiProperty } from '@nestjs/swagger';
import { ResultDto } from '../../common/dto/result.dto';
import { Attendance } from '../entities/attendance.entity';

export class CheckInResponseDto extends ResultDto<Attendance> {
  @ApiProperty({ type: Attendance, required: false })
  attendance?: Attendance;

  constructor(partial: Partial<CheckInResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  static success(attendance: Attendance) {
    return new CheckInResponseDto({
      ...ResultDto.ok(attendance, 'Check-in successful'),
      attendance,
    });
  }

  static error(reason: string, statusCode = 400) {
    return new CheckInResponseDto({
      ...ResultDto.fail(reason, statusCode),
    });
  }
}
