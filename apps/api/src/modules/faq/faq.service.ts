/**
 * @fileoverview FAQ Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Faq } from '@prisma/client';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all active FAQs ordered by order asc (public)
   */
  async findAllActive(): Promise<Faq[]> {
    return this.prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get all FAQs ordered by order asc (admin)
   */
  async findAll(): Promise<Faq[]> {
    return this.prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get single FAQ by ID
   */
  async findById(id: string): Promise<Faq> {
    const faq = await this.prisma.faq.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException('找不到此常見問答');
    }

    return faq;
  }

  /**
   * Create new FAQ
   */
  async create(dto: CreateFaqDto): Promise<Faq> {
    // Get max order and add 1
    const maxOrder = await this.prisma.faq.aggregate({
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? 0) + 1;

    return this.prisma.faq.create({
      data: {
        question: dto.question,
        answer: dto.answer,
        order: dto.order ?? order,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Update FAQ
   */
  async update(id: string, dto: UpdateFaqDto): Promise<Faq> {
    await this.findById(id);

    return this.prisma.faq.update({
      where: { id },
      data: {
        question: dto.question,
        answer: dto.answer,
        order: dto.order,
        isActive: dto.isActive,
      },
    });
  }

  /**
   * Delete FAQ
   */
  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.faq.delete({ where: { id } });
  }

  /**
   * Reorder FAQs atomically
   */
  async reorder(orderedIds: string[]): Promise<Faq[]> {
    // Use transaction to ensure atomic reorder
    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.faq.update({
          where: { id },
          data: { order: index + 1 },
        }),
      ),
    );

    return this.findAll();
  }
}
