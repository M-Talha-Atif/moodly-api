// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

/**
 * AuthModule
 *
 * Provides authentication functionality including:
 * - User signup & login
 * - JWT-based authentication
 * - Logout with cookie management
 *
 * Imports:
 * - UsersModule: for user management and persistence
 * - JwtModule: for JWT token creation/verification
 *
 * Exports:
 * - JwtModule: so other modules (e.g. guards) can use it globally
 */
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true, // makes JwtService available app-wide
      secret: process.env.JWT_SECRET, // secret used for signing tokens
      signOptions: { expiresIn: '1d' }, // default token expiry
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
