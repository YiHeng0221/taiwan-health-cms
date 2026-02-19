/**
 * @fileoverview Users Service
 * 
 * Handles user data access layer.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find user by email (includes password for auth)
   */
  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Get all users (admin only)
   */
  async findAll(): Promise<Omit<PrismaUser, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(({ password: _, ...user }) => user);
  }
}
