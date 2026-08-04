import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/common/enums/user.enums';
import { LoginResponseDto } from './dto/login-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { ResultDto } from '../common/dto/result.dto';
import { AuthProvider } from 'src/common/enums/user.enums';
import {
  PASSWORD_HASH_SALT_ROUNDS,
  REFRESH_TOKEN_HASH_SALT_ROUNDS,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async generateTokens(userId: string, email: string, role: string) {
    const accessTokenPayload = { sub: userId, email, role };
    const refreshTokenPayload = { sub: userId }; // Minimal payload for refresh

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: process.env.JWT_REFRESH_SECRET, // Different secret for refresh tokens
        expiresIn: REFRESH_TOKEN_EXPIRY,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const exists = await this.usersService.findByEmail(signUpDto.email);
    if (exists) {
      return SignUpResponseDto.fail('Email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(
      signUpDto.password,
      PASSWORD_HASH_SALT_ROUNDS,
    );
    const user = await this.usersService.create({
      ...signUpDto,
      passwordHash,
      role: signUpDto.role || UserRole.USER,
    });

    return SignUpResponseDto.ok(user, 'User registered successfully', 201);
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email, true);
    if (!user || !user.passwordHash) {
      return LoginResponseDto.fail('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return LoginResponseDto.fail('Invalid credentials', 401);
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Hash refresh token before saving
    const refreshHash = await bcrypt.hash(
      tokens.refresh_token,
      REFRESH_TOKEN_HASH_SALT_ROUNDS,
    );
    await this.usersService.updateRefreshToken(user.id, refreshHash);

    return {
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          onboardingCompleted: user.onboardingCompleted,
        },
      },
    };
  }

  async refreshTokens(refreshToken: string): Promise<ResultDto<any>> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const userId = payload.sub;

      const user = await this.usersService.findById(userId);
      if (!user || !user.refreshTokenHash) {
        return ResultDto.fail('Access denied', 403);
      }

      // Compare against the stored hash rather than a raw token, so a leaked DB row alone
      // can't be replayed as a valid refresh token.
      const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isMatch) {
        return ResultDto.fail('Invalid refresh token', 403);
      }

      // Rotate on every refresh: old refresh token becomes unusable once this is saved.
      const tokens = await this.generateTokens(user.id, user.email, user.role);
      const newRefreshHash = await bcrypt.hash(
        tokens.refresh_token,
        REFRESH_TOKEN_HASH_SALT_ROUNDS,
      );
      await this.usersService.updateRefreshToken(user.id, newRefreshHash);

      return ResultDto.ok(
        {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        },
        'Tokens refreshed successfully',
        200,
      );
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return ResultDto.fail('Invalid token', 403);
      }
      if (error.name === 'TokenExpiredError') {
        return ResultDto.fail('Refresh token expired', 403);
      }

      return ResultDto.fail('Invalid or expired refresh token', 403);
    }
  }

  async validateGoogleLogin(userInfo: {
    email: string;
    name?: string;
    avatarUrl?: string;
  }): Promise<{ access_token: string; user: any }> {
    // Check if user already exists
    let user = await this.usersService.findByEmail(userInfo.email);

    if (!user) {
      user = await this.usersService.create({
        email: userInfo.email,
        name: userInfo.name,
        avatarUrl: userInfo.avatarUrl,
        role: UserRole.USER,
        provider: AuthProvider.GOOGLE, // mark OAuth provider
      });
    }

    // JWT payload
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token, user };
  }

  // Cookie clearing happens in AuthController; this only invalidates the stored refresh token.
  async logout(userId: string): Promise<ResultDto<null>> {
    await this.usersService.updateRefreshToken(userId, null);
    return ResultDto.ok(null, 'Logout successful', 200);
  }
}
