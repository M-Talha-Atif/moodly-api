import { ApiProperty } from '@nestjs/swagger';
import { ResultDto } from '../../common/dto/result.dto';
import { User } from '../../users/entities/user.entity';

/**
 * DTO representing the response after a successful user sign-up.
 *
 * Extends the standardized ResultDto to include the created User entity.
 */
export class SignUpResponseDto extends ResultDto<User> {
  /**
   * Initializes the SignUpResponseDto with provided properties.
   *
   * @param partial - Partial response data (success, message, data, etc.).
   */
  constructor(partial: Partial<SignUpResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
