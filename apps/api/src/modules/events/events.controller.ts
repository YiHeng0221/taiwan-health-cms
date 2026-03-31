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
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /** Public: published events with pagination */
  @Public()
  @Get()
  async findAllPublished(@Query() query: QueryEventDto) {
    return this.eventsService.findAllPublished(query);
  }

  /** Admin: all events with pagination */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async findAll(@Query() query: QueryEventDto) {
    return this.eventsService.findAll(query);
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
  async create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  /** Admin: update */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  /** Admin: delete */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.eventsService.remove(id);
    return { message: '活動已刪除' };
  }
}
