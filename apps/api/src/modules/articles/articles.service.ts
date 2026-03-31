/**
 * @fileoverview Articles Service
 * 
 * Business logic layer for article operations.
 * Separation from controller ensures testability and reusability.
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { Article, Prisma } from '@prisma/client';
import { PaginatedResponse, ArticleListItem } from '@taiwan-health/shared-types';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Create a new article
   * Generates slug from title if not provided
   */
  async create(dto: CreateArticleDto, authorId?: string): Promise<Article> {
    // Generate slug from title if not provided
    const slug = dto.slug || this.generateSlug(dto.title);

    // Check for slug uniqueness
    const existingArticle = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      throw new ConflictException('此網址代稱已被使用');
    }

    return this.prisma.article.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content as unknown as Prisma.InputJsonValue,
        coverImage: dto.coverImage || this.extractFirstImage(dto.content),
        metaDescription: dto.metaDescription,
        isPublished: dto.isPublished ?? false,
        authorId,
      },
    });
  }

  /**
   * Get all articles with pagination
   * Supports filtering by published status
   */
  async findAll(
    query: QueryArticleDto,
  ): Promise<PaginatedResponse<ArticleListItem>> {
    const { page = 1, pageSize = 10, isPublished, search } = query;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { metaDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute count and find in parallel
    const [total, articles] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          isPublished: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      items: articles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Get article by slug (public)
   */
  async findBySlug(slug: string): Promise<Article> {
    const article = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('找不到此文章');
    }

    return article;
  }

  /**
   * Get article by ID (admin)
   */
  async findById(id: string): Promise<Article> {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('找不到此文章');
    }

    return article;
  }

  /**
   * Update article
   */
  async update(id: string, dto: UpdateArticleDto): Promise<Article> {
    // Ensure article exists
    await this.findById(id);

    // Check slug uniqueness if changing
    if (dto.slug) {
      const existingArticle = await this.prisma.article.findFirst({
        where: {
          slug: dto.slug,
          NOT: { id },
        },
      });

      if (existingArticle) {
        throw new ConflictException('此網址代稱已被使用');
      }
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        ...dto,
        content: dto.content as unknown as Prisma.InputJsonValue,
        coverImage: dto.coverImage || this.extractFirstImage(dto.content),
      },
    });
  }

  /**
   * Delete article
   */
  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.article.delete({ where: { id } });
  }

  /**
   * Toggle publish status
   */
  async togglePublish(id: string): Promise<Article> {
    const article = await this.findById(id);

    return this.prisma.article.update({
      where: { id },
      data: { isPublished: !article.isPublished },
    });
  }

  /**
   * Generate URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
      locale: 'zh-TW',
    });
  }

  /**
   * Extract the first image URL from Tiptap JSON content.
   * Recursively searches through nested content nodes.
   */
  private extractFirstImage(content: unknown): string | undefined {
    if (!content || typeof content !== 'object') return undefined;

    const node = content as Record<string, unknown>;

    // Found an image node
    if (node.type === 'image' && node.attrs) {
      const src = (node.attrs as Record<string, unknown>).src;
      if (typeof src === 'string') return src;
    }

    // Recurse into content array
    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        const found = this.extractFirstImage(child);
        if (found) return found;
      }
    }

    return undefined;
  }
}
