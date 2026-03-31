/**
 * @fileoverview Contact Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { ContactSubmission } from '@prisma/client';
import { PaginatedResponse } from '@taiwan-health/shared-types';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto): Promise<ContactSubmission> {
    return this.prisma.contactSubmission.create({
      data: dto,
    });
  }

  async findAll(query: QueryContactDto): Promise<PaginatedResponse<ContactSubmission>> {
    const { page = 1, pageSize = 10, isRead } = query;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};

    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const [total, items] = await Promise.all([
      this.prisma.contactSubmission.count({ where }),
      this.prisma.contactSubmission.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string): Promise<ContactSubmission> {
    const submission = await this.prisma.contactSubmission.findUnique({
      where: { id },
    });
    if (!submission) {
      throw new NotFoundException('找不到此聯絡訊息');
    }
    return submission;
  }

  async markAsRead(id: string): Promise<ContactSubmission> {
    await this.findById(id);
    return this.prisma.contactSubmission.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.contactSubmission.delete({
      where: { id },
    });
  }
}
