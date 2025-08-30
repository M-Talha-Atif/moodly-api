import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid signup request' })
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const result = await this.authService.signUp(signUpDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and issue JWT cookie' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear JWT cookie' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(@Res({ passthrough: true }) response: Response) {
    const result = await this.authService.logout();
    response.clearCookie('jwt');
    return response.status(result.statusCode).json(result);
  }
}
