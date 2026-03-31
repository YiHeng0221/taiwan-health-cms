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
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /** Public: get site settings */
  @Public()
  @Get()
  async get() {
    return this.settingsService.get();
  }

  /** Admin: update site settings */
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto);
  }
}
