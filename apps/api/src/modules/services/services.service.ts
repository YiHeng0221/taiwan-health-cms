/**
 * @fileoverview Services CRUD Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Service } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import { PaginatedResponse } from '@taiwan-health/shared-types';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: get all active services ordered */
  async findAllActive(): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  /** Admin: get all services with pagination */
  async findAll(query: QueryServiceDto): Promise<PaginatedResponse<Service>> {
    const { page = 1, pageSize = 10, isActive } = query;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [total, items] = await Promise.all([
      this.prisma.service.count({ where }),
      this.prisma.service.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { order: 'asc' },
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /** Get single service by ID */
  async findOne(id: string): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('服務項目不存在');
    return service;
  }

  /** Create */
  async create(dto: CreateServiceDto): Promise<Service> {
    return this.prisma.service.create({
      data: {
        title: dto.title,
        description: dto.description,
        icon: dto.icon ?? 'activity',
        image: dto.image,
        features: dto.features ?? [],
        order: dto.order ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /** Update */
  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    await this.findOne(id);
    return this.prisma.service.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        icon: dto.icon,
        image: dto.image,
        features: dto.features,
        order: dto.order,
        isActive: dto.isActive,
      },
    });
  }

  /** Delete */
  async remove(id: string): Promise<Service> {
    await this.findOne(id);
    return this.prisma.service.delete({ where: { id } });
  }
}
