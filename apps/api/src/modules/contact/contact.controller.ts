/**
 * @fileoverview Contact Controller
 */

import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public, Roles } from '../../common/decorators';
import { UserRole } from '@taiwan-health/shared-types';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * POST /api/contact
   * Public contact form submission (rate limited: 5 per minute)
   */
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  async create(@Body() dto: CreateContactDto) {
    await this.contactService.create(dto);
    return { message: '感謝您的來信，我們會盡快回覆您！' };
  }

  /**
   * GET /api/contact
   * Get all submissions with pagination (admin)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query() query: QueryContactDto) {
    return this.contactService.findAll(query);
  }

  /**
   * PATCH /api/contact/:id/read
   * Mark submission as read
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  /**
   * DELETE /api/contact/:id
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.contactService.remove(id);
    return { message: '訊息已刪除' };
  }
}
