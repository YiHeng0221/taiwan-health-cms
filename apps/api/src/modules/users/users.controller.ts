/**
 * @fileoverview Users Controller
 */

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators';
import { UserRole } from '@taiwan-health/shared-types';
import { UserRole as PrismaUserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users
   * List all users (admin only)
   */
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  /**
   * POST /api/users
   * Create a new user (admin only)
   */
  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: { email: string; password: string; role?: string },
  ) {
    return this.usersService.create({
      email: body.email,
      password: body.password,
      role: body.role as PrismaUserRole | undefined,
    });
  }
}
