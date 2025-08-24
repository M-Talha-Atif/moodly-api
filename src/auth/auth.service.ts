import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { ResultDto } from '../common/dto/result.dto';

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
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email, true);
    console.log('User found:', user);
    if (!user) {
      return LoginResponseDto.fail('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return LoginResponseDto.fail('Invalid credentials', 401);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return LoginResponseDto.ok(
      { access_token: token },
      'Login successful',
      200,
    );
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
  async logout(): Promise<ResultDto<null>> {
    return ResultDto.ok(null, 'Logout successful', 200);
  }
}
