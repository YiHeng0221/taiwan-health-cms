/**
 * @fileoverview Authentication Controller
 * 
 * REST API endpoints for authentication.
 * JWT tokens are set as HttpOnly cookies for security.
 */

import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, Public } from '../../common/decorators';
import { User } from '@taiwan-health/shared-types';

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/login
   * Authenticates user and sets JWT cookie
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set JWT as HttpOnly cookie
    res.cookie('access_token', result.accessToken, COOKIE_OPTIONS);

    return {
      user: result.user,
      message: '登入成功',
    };
  }

  /**
   * POST /api/auth/logout
   * Clears authentication cookie
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    return { message: '登出成功' };
  }

  /**
   * GET /api/auth/me
   * Returns current authenticated user
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: User) {
    return { user };
  }

  /**
   * POST /api/auth/refresh
   * Validates current token and issues new one
   */
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login({
      email: user.email,
      password: '', // Will be validated by guard, no need to re-check password
    });

    res.cookie('access_token', result.accessToken, COOKIE_OPTIONS);

    return {
      user: result.user,
      message: 'Token 已更新',
    };
  }
}
