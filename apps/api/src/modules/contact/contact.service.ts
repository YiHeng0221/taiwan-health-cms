/**
 * @fileoverview Contact Service
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactSubmission } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto): Promise<ContactSubmission> {
    return this.prisma.contactSubmission.create({
      data: dto,
    });
  }

  async findAll(): Promise<ContactSubmission[]> {
    return this.prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string): Promise<ContactSubmission> {
    return this.prisma.contactSubmission.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
