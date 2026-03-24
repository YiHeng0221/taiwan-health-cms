/**
 * @fileoverview Articles Controller
 * 
 * REST API endpoints for articles.
 * Public routes for reading, protected routes for CRUD operations.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public, CurrentUser } from '../../common/decorators';
import { User } from '@taiwan-health/shared-types';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // =========================================================================
  // Public Routes (marked with @Public decorator)
  // =========================================================================

  /**
   * GET /api/articles
   * List published articles with pagination
   */
  @Public()
  @Get()
  async findAll(@Query() query: QueryArticleDto) {
    // Force isPublished=true for public access
    return this.articlesService.findAll({ ...query, isPublished: true });
  }

  /**
   * GET /api/articles/slug/:slug
   * Get single published article by slug
   */
  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const article = await this.articlesService.findBySlug(slug);
    
    // Only return published articles publicly
    if (!article.isPublished) {
      throw new NotFoundException('找不到此文章');
    }
    
    return article;
  }

  // =========================================================================
  // Admin Routes (protected by JwtAuthGuard)
  // =========================================================================

  /**
   * GET /api/articles/admin
   * List all articles for admin (including unpublished)
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async findAllAdmin(@Query() query: QueryArticleDto) {
    return this.articlesService.findAll(query);
  }

  /**
   * GET /api/articles/admin/:id
   * Get article by ID for editing
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async findById(@Param('id') id: string) {
    return this.articlesService.findById(id);
  }

  /**
   * POST /api/articles
   * Create new article
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ) {
    return this.articlesService.create(createArticleDto, user.id);
  }

  /**
   * PUT /api/articles/:id
   * Update article
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  /**
   * PATCH /api/articles/:id/publish
   * Toggle article publish status
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/publish')
  async togglePublish(@Param('id') id: string) {
    return this.articlesService.togglePublish(id);
  }

  /**
   * DELETE /api/articles/:id
   * Delete article
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.articlesService.remove(id);
    return { message: '文章已刪除' };
  }
}
