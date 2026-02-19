/**
 * @fileoverview Events Controller
 */

import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { Public } from '../../common/decorators';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  async findAll() {
    return this.eventsService.findAllPublished();
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }
}
