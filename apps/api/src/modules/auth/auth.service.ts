/**
 * @fileoverview Authentication Service
 * 
 * Handles login, logout, and token validation logic.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, User, AuthResponse } from '@taiwan-health/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials and returns JWT token
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('帳號或密碼錯誤');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('帳號或密碼錯誤');
    }

    // Generate JWT token
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  /**
   * Validates JWT token and returns user
   */
  async validateToken(payload: JwtPayload): Promise<User | null> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      createdAt: user.createdAt,
    };
  }

  /**
   * Gets current user from token
   */
  async getCurrentUser(userId: string): Promise<User | null> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      createdAt: user.createdAt,
    };
  }
}
