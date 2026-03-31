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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public, Roles } from '../../common/decorators';
import { UserRole } from '@taiwan-health/shared-types';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /** GET /api/services — public list (all active, no pagination needed for public) */
  @Public()
  @Get()
  async findAllActive() {
    return this.servicesService.findAllActive();
  }

  /** GET /api/services/admin — admin list with pagination */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  async findAll(@Query() query: QueryServiceDto) {
    return this.servicesService.findAll(query);
  }

  /** GET /api/services/admin/:id */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/:id')
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  /** POST /api/services/admin */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin')
  async create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  /** PUT /api/services/admin/:id */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  /** DELETE /api/services/admin/:id */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/:id')
  async remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
