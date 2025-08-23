import { IsEmail, IsString } from 'class-validator';

/**
 * DTO representing the payload for login requests.
 *
 * Validates incoming login data using class-validator decorators
 * to ensure request integrity before reaching the service layer.
 */
export class LoginDto {
  /**
   * The user's email address.
   * Must be a valid email format.
   */
  @IsEmail()
  email: string;

  /**
   * The user's password in plain text.
   * Must be provided as a non-empty string.
   */
  @IsString()
  password: string;
}
