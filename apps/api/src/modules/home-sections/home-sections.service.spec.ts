import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HomeSectionsService } from './home-sections.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockSection = {
  id: 'hs-1',
  type: 'hero',
  config: { title: '歡迎' },
  order: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  homeSection: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    aggregate: jest.fn(),
  },
  $transaction: jest.fn((args: unknown) => {
    if (Array.isArray(args)) return Promise.all(args);
    return (args as () => Promise<unknown>)();
  }),
};

describe('HomeSectionsService', () => {
  let service: HomeSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeSectionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<HomeSectionsService>(HomeSectionsService);
    jest.clearAllMocks();
  });

  describe('findAllActive', () => {
    it('should return active sections ordered', async () => {
      mockPrisma.homeSection.findMany.mockResolvedValue([mockSection]);

      const result = await service.findAllActive();
      expect(result).toHaveLength(1);
      expect(mockPrisma.homeSection.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('findAll', () => {
    it('should return all sections ordered', async () => {
      mockPrisma.homeSection.findMany.mockResolvedValue([mockSection]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return section', async () => {
      mockPrisma.homeSection.findUnique.mockResolvedValue(mockSection);

      const result = await service.findById('hs-1');
      expect(result).toEqual(mockSection);
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.homeSection.findUnique.mockResolvedValue(null);

      await expect(service.findById('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create section with auto-incremented order', async () => {
      mockPrisma.homeSection.aggregate.mockResolvedValue({ _max: { order: 3 } });
      mockPrisma.homeSection.create.mockResolvedValue(mockSection);

      const result = await service.create({
        type: 'banner' as any,
        config: { title: '歡迎', subtitle: '', backgroundImage: '' } as any,
      });
      expect(result).toEqual(mockSection);
      expect(mockPrisma.homeSection.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ order: 4 }),
      });
    });

    it('should default to order 1 when no sections exist', async () => {
      mockPrisma.homeSection.aggregate.mockResolvedValue({ _max: { order: null } });
      mockPrisma.homeSection.create.mockResolvedValue(mockSection);

      await service.create({
        type: 'banner' as any,
        config: { title: '歡迎', subtitle: '', backgroundImage: '' } as any,
      });
      expect(mockPrisma.homeSection.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ order: 1 }),
      });
    });

    it('should use provided order', async () => {
      mockPrisma.homeSection.aggregate.mockResolvedValue({ _max: { order: 3 } });
      mockPrisma.homeSection.create.mockResolvedValue(mockSection);

      await service.create({ type: 'banner' as any, config: { title: '', subtitle: '', backgroundImage: '' } as any, order: 10 });
      expect(mockPrisma.homeSection.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ order: 10 }),
      });
    });
  });

  describe('update', () => {
    it('should update section', async () => {
      mockPrisma.homeSection.findUnique.mockResolvedValue(mockSection);
      mockPrisma.homeSection.update.mockResolvedValue({ ...mockSection, type: 'banner' });

      const result = await service.update('hs-1', { type: 'banner' });
      expect(result.type).toBe('banner');
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.homeSection.findUnique.mockResolvedValue(null);

      await expect(service.update('nope', { type: 'banner' as any })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete section', async () => {
      mockPrisma.homeSection.findUnique.mockResolvedValue(mockSection);
      mockPrisma.homeSection.delete.mockResolvedValue(mockSection);

      await expect(service.remove('hs-1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.homeSection.findUnique.mockResolvedValue(null);

      await expect(service.remove('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('reorder', () => {
    it('should update order atomically via transaction', async () => {
      mockPrisma.homeSection.update.mockResolvedValue(mockSection);
      mockPrisma.homeSection.findMany.mockResolvedValue([mockSection]);

      await service.reorder(['hs-2', 'hs-1']);

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrisma.homeSection.update).toHaveBeenCalledWith({
        where: { id: 'hs-2' },
        data: { order: 1 },
      });
      expect(mockPrisma.homeSection.update).toHaveBeenCalledWith({
        where: { id: 'hs-1' },
        data: { order: 2 },
      });
    });
  });
});
