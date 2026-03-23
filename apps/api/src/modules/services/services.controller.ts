/**
 * @fileoverview Services Controller
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
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  /** GET /api/services — public list */
  @Public()
  @Get()
  async findAllActive() {
    return this.servicesService.findAllActive();
  }

  /** GET /api/services/admin — admin list */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async findAll() {
    return this.servicesService.findAll();
  }

  /** GET /api/services/admin/:id */
  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  /** POST /api/services/admin */
  @UseGuards(JwtAuthGuard)
  @Post('admin')
  async create(
    @Body()
    body: {
      title: string;
      description: string;
      icon?: string;
      image?: string;
      features?: string[];
      order?: number;
      isActive?: boolean;
    },
  ) {
    return this.servicesService.create(body);
  }

  /** PUT /api/services/admin/:id */
  @UseGuards(JwtAuthGuard)
  @Put('admin/:id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      icon?: string;
      image?: string;
      features?: string[];
      order?: number;
      isActive?: boolean;
    },
  ) {
    return this.servicesService.update(id, body);
  }

  /** DELETE /api/services/admin/:id */
  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  async remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
