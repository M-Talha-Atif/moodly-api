import { ResultDto } from '../../common/dto/result.dto';

/**
 * DTO representing the response after a successful login.
 *
 * Extends ResultDto to standardize the API response format
 * while embedding the access token payload.
 */
export class LoginResponseDto extends ResultDto<{ access_token: string }> {
  /**
   * Initializes the LoginResponseDto with sanitized data.
   *
   * @param partial - Partial response properties (success, message, data, etc.).
   *                  The `data` field is automatically sanitized via ResultDto.
   */
  constructor(partial: Partial<LoginResponseDto>) {
    super({
      ...partial,
      data: ResultDto['sanitizeData'](partial.data),
    });
  }
}
