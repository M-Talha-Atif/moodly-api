import { OmitType } from '@nestjs/mapped-types';
import { SignUpDto } from '../../auth/dto/signup.dto';

// Inherits from SignUpDto but removes password (handled separately in auth flow)
export class CreateUserDto extends OmitType(SignUpDto, ['password'] as const) {
  passwordHash: string; // Added by AuthService after hashing
}
