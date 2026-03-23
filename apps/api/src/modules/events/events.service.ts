/**
 * @fileoverview Events Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) { }

  /** Public: published events */
  async findAllPublished(): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { date: 'desc' },
    });
  }

  /** Admin: all events */
  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany({
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

  async findById(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('找不到此活動');
    return event;
  }

  async create(data: {
    title: string;
    slug: string;
    description: string;
    date: Date;
    location: string;
    images?: string[];
    isPublished?: boolean;
  }): Promise<Event> {
    return this.prisma.event.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        date: data.date,
        location: data.location,
        images: data.images ?? [],
        isPublished: data.isPublished ?? false,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      slug?: string;
      description?: string;
      date?: Date;
      location?: string;
      images?: string[];
      isPublished?: boolean;
    },
  ): Promise<Event> {
    await this.findById(id);
    return this.prisma.event.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.event.delete({ where: { id } });
  }
}
