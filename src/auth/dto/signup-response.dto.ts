import { ApiProperty } from '@nestjs/swagger';
import { ResultDto } from '../../common/dto/result.dto';
import { User } from '../../users/entities/user.entity';

export class SignUpResponseDto extends ResultDto<User> {
  constructor(partial: Partial<SignUpResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
