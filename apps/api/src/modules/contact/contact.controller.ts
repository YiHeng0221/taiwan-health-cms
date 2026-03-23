/**
 * @fileoverview Contact Controller
 */

import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  /**
   * POST /api/contact
   * Public contact form submission
   */
  @Public()
  @Post()
  async create(@Body() dto: CreateContactDto) {
    await this.contactService.create(dto);
    return { message: '感謝您的來信，我們會盡快回覆您！' };
  }

  /**
   * GET /api/contact
   * Get all submissions (admin)
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.contactService.findAll();
  }

  /**
   * PATCH /api/contact/:id/read
   * Mark submission as read
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  /**
   * DELETE /api/contact/:id
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.contactService.remove(id);
    return { message: '訊息已刪除' };
  }
}
