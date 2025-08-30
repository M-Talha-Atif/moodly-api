import { OmitType } from '@nestjs/mapped-types';
import { SignUpDto } from '../../auth/dto/signup.dto';
import { ApiProperty } from '@nestjs/swagger';

// Inherits from SignUpDto but removes password
export class CreateUserDto extends OmitType(SignUpDto, ['password'] as const) {
  @ApiProperty({
    example: '$2b$10$kfj39fj39fj39fj39fj39fj39fj39fj39fj39fj39fj39fj39fj',
    description: 'Hashed password (added by AuthService)',
  })
  passwordHash: string;
}
