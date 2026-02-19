/**
 * @fileoverview Events Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublished(): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { date: 'desc' },
    });
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
}
