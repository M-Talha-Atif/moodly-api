import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

/**
 * Controller responsible for handling user authentication.
 *
 * Exposes endpoints for:
 * - Signing up new users
 * - Logging in existing users (with JWT cookie)
 * - Logging out users (clearing cookies)
 *
 * Business logic is delegated to the AuthService.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/signup
   *
   * Creates a new user account.
   * - Expects a SignUpDto payload in the request body.
   * - Returns a standardized JSON response with success/failure.
   * - Response status code reflects the outcome (201 on success).
   */
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const result = await this.authService.signUp(signUpDto);
    return res.status(result.statusCode).json(result);
  }

  /**
   * POST /auth/login
   *
   * Authenticates a user with email + password.
   * - Expects a LoginDto payload in the request body.
   * - On success, issues a JWT as a secure, httpOnly cookie.
   * - Returns a standardized JSON response with login result.
   * - Cookie is configured for 24h expiry, strict same-site,
   *   and secure flag in production.
   */
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    if (result.success && result.data?.access_token) {
      response.cookie('jwt', result.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24h
      });
    }

    response.status(result.statusCode);
    return result;
  }

  /**
   * POST /auth/logout
   *
   * Logs out the current user.
   * - Clears the JWT cookie from the client.
   * - Returns a standardized JSON response confirming logout.
   * - Always responds with HTTP 200 on success.
   * - Kept it for future use cases
   */
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    const result = await this.authService.logout();
    response.clearCookie('jwt');
    return response.status(result.statusCode).json(result);
  }
}
