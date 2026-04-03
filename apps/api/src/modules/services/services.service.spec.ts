import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockService = {
  id: 'svc-1',
  title: '健康檢查',
  description: '完整健檢',
  icon: 'activity',
  image: null,
  features: ['血液檢查', 'X光'],
  order: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  service: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('ServicesService', () => {
  let service: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    jest.clearAllMocks();
  });

  describe('findAllActive', () => {
    it('should return active services ordered by order', async () => {
      mockPrisma.service.findMany.mockResolvedValue([mockService]);

      const result = await service.findAllActive();
      expect(result).toHaveLength(1);
      expect(mockPrisma.service.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated services', async () => {
      mockPrisma.service.count.mockResolvedValue(1);
      mockPrisma.service.findMany.mockResolvedValue([mockService]);

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should filter by isActive', async () => {
      mockPrisma.service.count.mockResolvedValue(0);
      mockPrisma.service.findMany.mockResolvedValue([]);

      await service.findAll({ page: 1, pageSize: 10, isActive: false });

      const countWhere = mockPrisma.service.count.mock.calls[0][0].where;
      expect(countWhere.isActive).toBe(false);
    });
  });

  describe('findOne', () => {
    it('should return service', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(mockService);

      const result = await service.findOne('svc-1');
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create service with defaults', async () => {
      mockPrisma.service.create.mockResolvedValue(mockService);

      const result = await service.create({
        title: '健康檢查',
        description: '完整健檢',
      });

      expect(result).toEqual(mockService);
      expect(mockPrisma.service.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: '健康檢查',
          icon: 'activity',
          order: 0,
          isActive: true,
        }),
      });
    });
  });

  describe('update', () => {
    it('should update service', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(mockService);
      mockPrisma.service.update.mockResolvedValue({ ...mockService, title: '新標題' });

      const result = await service.update('svc-1', { title: '新標題' });
      expect(result.title).toBe('新標題');
    });

    it('should throw NotFoundException if service not found', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(service.update('nope', { title: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete service', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(mockService);
      mockPrisma.service.delete.mockResolvedValue(mockService);

      const result = await service.remove('svc-1');
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(service.remove('nope')).rejects.toThrow(NotFoundException);
    });
  });
});
