// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
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
    JwtModule.registerAsync({
      global: true, //  makes JwtService injectable everywhere
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'), // now available
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
