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

@Injectable()
/**
 * AuthService
 *
 * Handles authentication-related operations such as:
 * - User registration (sign-up)
 * - User login (validates credentials and issues JWT)
 * - User logout (clears client cookie via controller)
 *
 * Depends on:
 * - UsersService: for user persistence & lookup
 * - JwtService: for JWT token generation
 */
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Function to generate the refresh token and access token for the user
   * @param userId
   * @param email
   * @param role
   * @returns
   */
  private async generateTokens(userId: string, email: string, role: string) {
    const accessTokenPayload = { sub: userId, email, role };
    const refreshTokenPayload = { sub: userId }; // Minimal payload for refresh

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '3m',
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: process.env.JWT_REFRESH_SECRET, // Different secret for refresh tokens
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }

  /**
   * Registers a new user.
   *
   * Steps:
   * 1. Checks if a user with the given email already exists.
   * 2. Hashes the provided password with bcrypt.
   * 3. Creates the user in the database with a default or provided role.
   *
   * @param signUpDto - DTO containing user registration details.
   * @returns SignUpResponseDto with created user data or an error response.
   */
  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const exists = await this.usersService.findByEmail(signUpDto.email);
    if (exists) {
      return SignUpResponseDto.fail('Email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(signUpDto.password, 12);
    const user = await this.usersService.create({
      ...signUpDto,
      passwordHash,
      role: signUpDto.role || UserRole.USER,
    });

    return SignUpResponseDto.ok(user, 'User registered successfully', 201);
  }

  /**
   * Authenticates a user and returns a signed JWT.
   *
   * Steps:
   * 1. Fetches user by email (with password hash).
   * 2. Verifies the provided password using bcrypt.
   * 3. Generates a JWT payload with user id, email, and role.
   * 4. Signs and returns the token.
   *
   * @param loginDto - DTO containing user login credentials.
   * @returns LoginResponseDto with JWT access token or an error response.
   */
  // auth.service.ts
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
    const refreshHash = await bcrypt.hash(tokens.refresh_token, 10);
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

  async refreshTokens(
    refreshToken: string, // Remove userId from parameters
  ): Promise<ResultDto<any>> {
    try {
      // 1. Verify the refresh token and extract payload
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET, // Use same secret that was used to sign
      });
      const userId = payload.sub;

      // 2. Find user by ID from the token
      const user = await this.usersService.findById(userId);
      if (!user || !user.refreshTokenHash) {
        return ResultDto.fail('Access denied', 403);
      }

      // 3. Compare the raw refresh token with the stored hash
      const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isMatch) {
        return ResultDto.fail('Invalid refresh token', 403);
      }

      // 4. Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // 5. Hash and save new refresh token (rotate it)
      const newRefreshHash = await bcrypt.hash(tokens.refresh_token, 10);
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
      console.log(error);
      console.log('❌ Refresh token error:', error.message);

      if (error.name === 'JsonWebTokenError') {
        return ResultDto.fail('Invalid token', 403);
      }
      if (error.name === 'TokenExpiredError') {
        return ResultDto.fail('Refresh token expired', 403);
      }

      return ResultDto.fail('Invalid or expired refresh token', 403);
    }
  }

  /**
   * Validate or create a Google OAuth user, then return JWT
   */
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

  /**
   * Logs out the current user.
   *
   * Note:
   * - Actual cookie clearing happens in the AuthController.
   * - This method just returns a success response object.
   *
   * @returns ResultDto with success message and 200 status.
   */
  async logout(userId: string): Promise<ResultDto<null>> {
    await this.usersService.updateRefreshToken(userId, null);
    return ResultDto.ok(null, 'Logout successful', 200);
  }
}
