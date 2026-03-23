/**
 * @fileoverview Events Controller
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
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  /** Public: published events */
  @Public()
  @Get()
  async findAllPublished() {
    return this.eventsService.findAllPublished();
  }

  /** Admin: all events */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async findAll() {
    return this.eventsService.findAll();
  }

  /** Admin: single event */
  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  /** Public: by slug */
  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  /** Admin: create */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    dto: {
      title: string;
      slug: string;
      description: string;
      date: string;
      location: string;
      images?: string[];
      isPublished?: boolean;
    },
  ) {
    return this.eventsService.create({
      ...dto,
      date: new Date(dto.date),
    });
  }

  /** Admin: update */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    dto: {
      title?: string;
      slug?: string;
      description?: string;
      date?: string;
      location?: string;
      images?: string[];
      isPublished?: boolean;
    },
  ) {
    return this.eventsService.update(id, {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    });
  }

  /** Admin: delete */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.eventsService.remove(id);
    return { message: '活動已刪除' };
  }
}
