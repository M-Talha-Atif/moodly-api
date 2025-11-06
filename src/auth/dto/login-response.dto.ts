// auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ResultDto } from '../../common/dto/result.dto';

export class UserLoginData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  onboardingCompleted: boolean;
}

export class LoginData {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty({ type: UserLoginData })
  user: UserLoginData;
}

export class LoginResponseDto extends ResultDto<LoginData> {}
