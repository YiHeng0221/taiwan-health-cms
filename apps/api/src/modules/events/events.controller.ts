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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public, Roles } from '../../common/decorators';
import { UserRole } from '@taiwan-health/shared-types';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Get('admin')
  async findAll(@Query() query: QueryEventDto) {
    return this.eventsService.findAll(query);
  }

  /** Admin: single event */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post()
  async create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  /** Admin: update */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  /** Admin: delete */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.eventsService.remove(id);
    return { message: '活動已刪除' };
  }
}
