import { ApiProperty } from '@nestjs/swagger';
import { ResultDto } from '../../common/dto/result.dto';
import { Attendance } from '../entities/attendance.entity';

export class CreateAttendanceResponseDto extends ResultDto<{
  attendance: Attendance;
  token: string;
}> {
  @ApiProperty({ type: Attendance })
  attendance: Attendance;

  @ApiProperty({ example: 'jwt.qr.token' })
  token: string;

  constructor(partial: Partial<CreateAttendanceResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
