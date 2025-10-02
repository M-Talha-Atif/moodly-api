import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { JwtCookieGuard } from './guards/jwt-cookie.guard';

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
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });
    }

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

  // ----------------------------
  // Google OAuth Routes
  // ----------------------------

  /**
   * Initiates Google OAuth flow
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {
    // Passport handles the redirect; no extra logic needed
    return;
  }
  // src/auth/auth.controller.ts
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    if (!req.user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
      );
    }

    const { access_token } = req.user;

    // Cookie set
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Redirect frontend → React Router handle karega
    return res.redirect(`${process.env.FRONTEND_URL}/auth/google/redirect`);
  }

  @Get('me')
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: 'Get current logged-in user' })
  @ApiResponse({ status: 200, description: 'Returns the current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() req: Request, @Res() res: Response) {
    // `req.user` JwtCookieGuard ne inject kar diya hai
    return res.status(200).json({
      success: true,
      data: req.user,
      message: 'Current logged-in user fetched successfully',
    });
  }
}
