/**
 * @fileoverview Site Settings Service
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, SiteSettings } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) { }

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
  async update(data: {
    siteName?: string;
    logo?: string;
    favicon?: string;
    footer?: Prisma.InputJsonValue;
    social?: Prisma.InputJsonValue;
    contact?: Prisma.InputJsonValue;
  }): Promise<SiteSettings> {
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
