/**
 * @fileoverview Home Sections Controller
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
import { HomeSectionsService } from './home-sections.service';
import { CreateHomeSectionDto } from './dto/create-home-section.dto';
import { UpdateHomeSectionDto } from './dto/update-home-section.dto';
import { ReorderHomeSectionsDto } from './dto/reorder-home-sections.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators';

@Controller('home-sections')
export class HomeSectionsController {
  constructor(private readonly homeSectionsService: HomeSectionsService) {}

  /**
   * GET /api/home-sections
   * Get active sections for public homepage
   */
  @Public()
  @Get()
  async findAllActive() {
    return this.homeSectionsService.findAllActive();
  }

  /**
   * GET /api/home-sections/admin
   * Get all sections for admin
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async findAll() {
    return this.homeSectionsService.findAll();
  }

  /**
   * GET /api/home-sections/admin/:id
   * Get section by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async findById(@Param('id') id: string) {
    return this.homeSectionsService.findById(id);
  }

  /**
   * POST /api/home-sections
   * Create new section
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateHomeSectionDto) {
    return this.homeSectionsService.create(dto);
  }

  /**
   * PUT /api/home-sections/:id
   * Update section
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateHomeSectionDto) {
    return this.homeSectionsService.update(id, dto);
  }

  /**
   * PATCH /api/home-sections/reorder
   * Reorder sections
   */
  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  async reorder(@Body() dto: ReorderHomeSectionsDto) {
    return this.homeSectionsService.reorder(dto.orderedIds);
  }

  /**
   * DELETE /api/home-sections/:id
   * Delete section
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.homeSectionsService.remove(id);
    return { message: '區塊已刪除' };
  }
}
