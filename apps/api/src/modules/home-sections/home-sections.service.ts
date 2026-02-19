/**
 * @fileoverview Home Sections Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HomeSection } from '@prisma/client';
import { CreateHomeSectionDto } from './dto/create-home-section.dto';
import { UpdateHomeSectionDto } from './dto/update-home-section.dto';

@Injectable()
export class HomeSectionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all active home sections ordered by position
   */
  async findAllActive(): Promise<HomeSection[]> {
    return this.prisma.homeSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get all home sections (admin)
   */
  async findAll(): Promise<HomeSection[]> {
    return this.prisma.homeSection.findMany({
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get single section by ID
   */
  async findById(id: string): Promise<HomeSection> {
    const section = await this.prisma.homeSection.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('找不到此區塊');
    }

    return section;
  }

  /**
   * Create new home section
   */
  async create(dto: CreateHomeSectionDto): Promise<HomeSection> {
    // Get max order and add 1
    const maxOrder = await this.prisma.homeSection.aggregate({
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? 0) + 1;

    return this.prisma.homeSection.create({
      data: {
        type: dto.type,
        config: dto.config as object,
        order: dto.order ?? order,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Update home section
   */
  async update(id: string, dto: UpdateHomeSectionDto): Promise<HomeSection> {
    await this.findById(id);

    return this.prisma.homeSection.update({
      where: { id },
      data: {
        type: dto.type,
        config: dto.config as object,
        order: dto.order,
        isActive: dto.isActive,
      },
    });
  }

  /**
   * Delete home section
   */
  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.homeSection.delete({ where: { id } });
  }

  /**
   * Reorder sections
   */
  async reorder(orderedIds: string[]): Promise<HomeSection[]> {
    // Update each section's order based on array position
    await Promise.all(
      orderedIds.map((id, index) =>
        this.prisma.homeSection.update({
          where: { id },
          data: { order: index + 1 },
        }),
      ),
    );

    return this.findAll();
  }
}
