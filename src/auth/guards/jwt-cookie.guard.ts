import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * JwtCookieGuard
 *
 * Custom NestJS guard that:
 * - Extracts a JWT from the request cookies.
 * - Verifies the token using JwtService.
 * - Attaches the decoded user payload to the request object.
 *
 * Usage:
 * - Apply to routes or controllers that require authentication.
 * - Returns `true` if the token is valid, otherwise blocks the request.
 */
@Injectable()
export class JwtCookieGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Determines whether the current request is authorized.
   *
   * Steps:
   * 1. Extracts the `jwt` cookie from the request.
   * 2. Verifies the token asynchronously with JwtService.
   * 3. On success, attaches the decoded payload to `request.user`.
   * 4. Returns `true` if valid, otherwise `false`.
   *
   * @param context - The execution context, giving access to the request object.
   * @returns Promise<boolean> - Whether the request can proceed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.jwt;

    if (!token) return false;

    try {
      const payload = await this.jwtService.verifyAsync(token); // verfies token is expired or not
      request.user = payload;
      // request.user = {
      //   sub: payload.sub,
      //   email: payload.email,
      //   role: payload.role,
      // };

      return true;
    } catch {
      return false;
    }
  }
}
