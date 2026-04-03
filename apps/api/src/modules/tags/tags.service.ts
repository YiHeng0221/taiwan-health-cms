/**
 * @fileoverview Tags Service
 *
 * Business logic for tag operations.
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all tags ordered by name
   */
  async findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get tag by ID with article count
   */
  async findById(id: string): Promise<Tag & { _count: { articles: number } }> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('找不到此標籤');
    }

    return tag;
  }

  /**
   * Create a new tag
   * Auto-generates slug from name
   */
  async create(dto: CreateTagDto): Promise<Tag> {
    const slug = this.generateSlug(dto.name);

    // Check uniqueness of name and slug
    const existing = await this.prisma.tag.findFirst({
      where: {
        OR: [{ name: dto.name }, { slug }],
      },
    });

    if (existing) {
      throw new ConflictException('此標籤名稱或網址代稱已被使用');
    }

    return this.prisma.tag.create({
      data: {
        name: dto.name,
        slug,
      },
    });
  }

  /**
   * Update tag
   */
  async update(id: string, dto: UpdateTagDto): Promise<Tag> {
    await this.findById(id);

    const data: Record<string, string> = {};

    if (dto.name) {
      data.name = dto.name;
      data.slug = this.generateSlug(dto.name);

      // Check uniqueness
      const existing = await this.prisma.tag.findFirst({
        where: {
          OR: [{ name: dto.name }, { slug: data.slug }],
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('此標籤名稱或網址代稱已被使用');
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete tag (cascade deletes ArticleTag relations)
   */
  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.tag.delete({ where: { id } });
  }

  /**
   * Generate URL-friendly slug from name
   */
  private generateSlug(name: string): string {
    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: 'zh-TW',
    });

    // slugify returns empty string for pure CJK text — fall back to timestamp
    if (!slug) {
      return `tag-${Date.now()}`;
    }

    return slug;
  }
}
