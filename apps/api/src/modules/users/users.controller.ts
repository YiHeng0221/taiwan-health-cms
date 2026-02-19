/**
 * @fileoverview Users Controller
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../auth/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@taiwan-health/shared-types';

// Roles decorator
const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

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
}
