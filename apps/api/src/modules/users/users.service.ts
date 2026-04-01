/**
 * @fileoverview Users Service
 * 
 * Handles user data access layer.
 */

import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User as PrismaUser, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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
   * Create a new user (admin only)
   */
  async create(data: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<Omit<PrismaUser, 'password'>> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('此 Email 已被使用');
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const { password: _, ...user } = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role || UserRole.ADMIN,
      },
    });
    return user;
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
