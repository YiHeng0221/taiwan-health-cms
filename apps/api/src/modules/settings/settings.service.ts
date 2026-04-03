/**
 * @fileoverview Site Settings Service
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, SiteSettings } from '@prisma/client';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get site settings (upsert default if not exists) */
  async get(): Promise<SiteSettings> {
    let settings = await this.prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await this.prisma.siteSettings.create({
        data: { id: 'default' },
      });
    }

    return settings;
  }

  /** Update site settings */
  async update(dto: UpdateSettingsDto): Promise<SiteSettings> {
    const data: Record<string, unknown> = {};
    if (dto.siteName !== undefined) data.siteName = dto.siteName;
    if (dto.logo !== undefined) data.logo = dto.logo;
    if (dto.favicon !== undefined) data.favicon = dto.favicon;
    if (dto.footer !== undefined) data.footer = dto.footer as Prisma.InputJsonValue;
    if (dto.social !== undefined) data.social = dto.social as Prisma.InputJsonValue;
    if (dto.contact !== undefined) data.contact = dto.contact as Prisma.InputJsonValue;
    if (dto.aboutPage !== undefined) data.aboutPage = dto.aboutPage as Prisma.InputJsonValue;

    return this.prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        ...data,
      },
    });
  }
}
