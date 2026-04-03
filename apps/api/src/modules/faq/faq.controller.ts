/**
 * @fileoverview FAQ Controller
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ReorderFaqDto } from './dto/reorder-faq.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public, Roles } from '../../common/decorators';
import { UserRole } from '@taiwan-health/shared-types';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  /**
   * GET /api/faq
   * Get active FAQs for public display
   */
  @Public()
  @Get()
  async findAllActive() {
    return this.faqService.findAllActive();
  }

  /**
   * GET /api/faq/admin
   * Get all FAQs for admin
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  async findAll() {
    return this.faqService.findAll();
  }

  /**
   * GET /api/faq/admin/:id
   * Get FAQ by ID
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/:id')
  async findById(@Param('id') id: string) {
    return this.faqService.findById(id);
  }

  /**
   * POST /api/faq
   * Create new FAQ
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateFaqDto) {
    return this.faqService.create(dto);
  }

  /**
   * PUT /api/faq/:id
   * Update FAQ
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.faqService.update(id, dto);
  }

  /**
   * PATCH /api/faq/reorder
   * Reorder FAQs
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('reorder')
  async reorder(@Body() dto: ReorderFaqDto) {
    return this.faqService.reorder(dto.orderedIds);
  }

  /**
   * DELETE /api/faq/:id
   * Delete FAQ
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.faqService.remove(id);
    return { message: '常見問答已刪除' };
  }
}
