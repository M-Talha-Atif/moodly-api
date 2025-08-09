import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  async logout(): Promise<ResultDto<null>> {
    return ResultDto.ok(null, 'Logout successful', 200);
  }
}
