import { OmitType } from '@nestjs/mapped-types';
import { SignUpDto } from '../../auth/dto/signup.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider } from 'src/common/enums/user.enums';
// Inherits from SignUpDto but removes password
export class CreateUserDto extends OmitType(SignUpDto, ['password'] as const) {
  @ApiProperty({
    example: '$2b$10$kfj39fj39fj39fj39fj39fj39fj39fj39fj39fj39fj39fj39fj',
    description: 'Hashed password (added by AuthService)',
    required: false,
  })
  passwordHash?: string; // optional for OAuth users

  @ApiProperty({ enum: AuthProvider, default: AuthProvider.LOCAL })
  provider?: AuthProvider; // enum type
}
