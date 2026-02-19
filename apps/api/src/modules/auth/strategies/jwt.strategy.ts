/**
 * @fileoverview JWT Passport Strategy
 * 
 * Extracts JWT from HttpOnly cookie and validates it.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { JwtPayload } from '@taiwan-health/shared-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      // Extract JWT from cookie OR Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First try cookie
        (request: Request) => {
          return request?.cookies?.access_token || null;
        },
        // Fallback to Bearer token
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates the JWT payload and returns user
   */
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateToken(payload);
    if (!user) {
      throw new UnauthorizedException('無效的認證');
    }
    return user;
  }
}
