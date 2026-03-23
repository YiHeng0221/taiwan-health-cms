/**
 * @fileoverview Services CRUD Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Service } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) { }

  /** Public: get all active services ordered */
  async findAllActive(): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  /** Admin: get all services */
  async findAll(): Promise<Service[]> {
    return this.prisma.service.findMany({ orderBy: { order: 'asc' } });
  }

  /** Get single service by ID */
  async findOne(id: string): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('服務項目不存在');
    return service;
  }

  /** Create */
  async create(data: {
    title: string;
    description: string;
    icon?: string;
    image?: string;
    features?: string[];
    order?: number;
    isActive?: boolean;
  }): Promise<Service> {
    return this.prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon ?? 'activity',
        image: data.image,
        features: data.features ?? [],
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  /** Update */
  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      icon?: string;
      image?: string;
      features?: string[];
      order?: number;
      isActive?: boolean;
    },
  ): Promise<Service> {
    await this.findOne(id); // ensure exists
    return this.prisma.service.update({ where: { id }, data });
  }

  /** Delete */
  async remove(id: string): Promise<Service> {
    await this.findOne(id);
    return this.prisma.service.delete({ where: { id } });
  }
}
