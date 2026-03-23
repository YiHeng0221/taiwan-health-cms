/**
 * @fileoverview Site Settings Controller
 */

import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  /** Public: get site settings */
  @Public()
  @Get()
  async get() {
    return this.settingsService.get();
  }

  /** Admin: update site settings */
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(
    @Body()
    dto: {
      siteName?: string;
      logo?: string;
      favicon?: string;
      footer?: Prisma.InputJsonValue;
      social?: Prisma.InputJsonValue;
      contact?: Prisma.InputJsonValue;
    },
  ) {
    return this.settingsService.update(dto);
  }
}
