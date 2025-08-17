import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// JwtCookieGuard is a custom guard that checks for a JWT token in cookies.
// It implements the CanActivate interface from NestJS, which allows it to be used as a guard in controllers.
// The guard extracts the JWT token from the request cookies, verifies it using the JwtService,
// and if valid, attaches the user payload to the request object.
@Injectable()
export class JwtCookieGuard implements CanActivate {
  // JwtService is injected to handle JWT operations such as verification.
  // The JwtService is part of the @nestjs/jwt package, which provides utilities for working with JSON Web Tokens.
  // The guard uses this service to verify the JWT token extracted from the request cookies.
  constructor(private jwtService: JwtService) {}

  // canActivate method is called by NestJS to determine if the request should be allowed to proceed.
  // It receives the ExecutionContext, which provides access to the request object.
  // The method checks for the presence of a JWT token in the request cookies.
  // If the token is found, it attempts to verify it using the JwtService.
  // If the token is valid, it attaches the user payload to the request object and returns true, allowing the request to proceed.
  // If the token is not found or verification fails,
  // it returns false, preventing the request from proceeding.
  // This guard can be applied to specific routes or globally to protect endpoints that require authentication.
  // The method returns a Promise<boolean> indicating whether the request can proceed.
  // If the token is valid, it attaches the user payload to the request object and returns true.
  // If the token is invalid or not present, it returns false.
  // This allows the guard to be used in conjunction with other guards or interceptors in the application.
  // The guard can be applied to specific routes or globally to protect endpoints that require authentication.
  // The method is asynchronous, allowing for non-blocking operations such as token verification.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.jwt;

    if (!token) return false;

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch {
      return false;
    }
  }
}
