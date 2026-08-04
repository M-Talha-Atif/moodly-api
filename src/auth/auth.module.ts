// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtCookieGuard } from './guards/jwt-cookie.guard';
import { DEFAULT_JWT_SIGN_EXPIRY } from './auth.constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: DEFAULT_JWT_SIGN_EXPIRY },
      }),
    }),
  ],
  providers: [AuthService, GoogleStrategy, JwtCookieGuard],
  controllers: [AuthController],
  exports: [JwtModule, JwtCookieGuard],
})
export class AuthModule {}
