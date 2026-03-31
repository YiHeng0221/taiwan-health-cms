/**
 * @fileoverview Events Service
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Event } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { PaginatedResponse } from '@taiwan-health/shared-types';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: published events with pagination */
  async findAllPublished(query: QueryEventDto): Promise<PaginatedResponse<Event>> {
    const { page = 1, pageSize = 10, search } = query;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = { isPublished: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: 'desc' },
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

  /** Admin: all events with pagination */
  async findAll(query: QueryEventDto): Promise<PaginatedResponse<Event>> {
    const { page = 1, pageSize = 10, isPublished, search } = query;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: 'desc' },
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

  async findBySlug(slug: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { slug },
    });
    if (!event || !event.isPublished) {
      throw new NotFoundException('找不到此活動');
    }
    return event;
  }

  async findById(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('找不到此活動');
    return event;
  }

  async create(dto: CreateEventDto): Promise<Event> {
    // Check slug uniqueness
    const existing = await this.prisma.event.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('此網址代稱已被使用');
    }

    return this.prisma.event.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        date: new Date(dto.date),
        location: dto.location,
        images: dto.images ?? [],
        isPublished: dto.isPublished ?? false,
      },
    });
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    await this.findById(id);

    // Check slug uniqueness if changing
    if (dto.slug) {
      const existing = await this.prisma.event.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('此網址代稱已被使用');
      }
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : undefined,
        location: dto.location,
        images: dto.images,
        isPublished: dto.isPublished,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.event.delete({ where: { id } });
  }
}
