import { ResultDto } from '../../common/dto/result.dto';

export class LoginResponseDto extends ResultDto<{ access_token: string }> {
  constructor(partial: Partial<LoginResponseDto>) {
    // Pass data through ResultDto sanitization
    super({
      ...partial,
      data: ResultDto['sanitizeData'](partial.data),
    });
  }
}
