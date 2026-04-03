import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockEvent = {
  id: 'evt-1',
  title: '健康講座',
  slug: 'health-talk',
  description: '說明',
  date: new Date('2026-06-01'),
  location: '台北',
  images: [],
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  event: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    jest.clearAllMocks();
  });

  describe('findAllPublished', () => {
    it('should return paginated published events', async () => {
      mockPrisma.event.count.mockResolvedValue(1);
      mockPrisma.event.findMany.mockResolvedValue([mockEvent]);

      const result = await service.findAllPublished({ page: 1, pageSize: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      const countWhere = mockPrisma.event.count.mock.calls[0][0].where;
      expect(countWhere.isPublished).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should return all events with pagination', async () => {
      mockPrisma.event.count.mockResolvedValue(2);
      mockPrisma.event.findMany.mockResolvedValue([mockEvent, mockEvent]);

      const result = await service.findAll({ page: 1, pageSize: 10 });
      expect(result.items).toHaveLength(2);
      expect(result.totalPages).toBe(1);
    });

    it('should filter by isPublished', async () => {
      mockPrisma.event.count.mockResolvedValue(0);
      mockPrisma.event.findMany.mockResolvedValue([]);

      await service.findAll({ page: 1, pageSize: 10, isPublished: false });

      const countWhere = mockPrisma.event.count.mock.calls[0][0].where;
      expect(countWhere.isPublished).toBe(false);
    });
  });

  describe('findBySlug', () => {
    it('should return published event', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);

      const result = await service.findBySlug('health-talk');
      expect(result.title).toBe('健康講座');
    });

    it('should throw NotFoundException for unpublished event', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ ...mockEvent, isPublished: false });

      await expect(service.findBySlug('health-talk')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return event', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);

      const result = await service.findById('evt-1');
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await expect(service.findById('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create event', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);
      mockPrisma.event.create.mockResolvedValue(mockEvent);

      const result = await service.create({
        title: '健康講座',
        slug: 'health-talk',
        description: '說明',
        date: '2026-06-01',
        location: '台北',
      });

      expect(result).toEqual(mockEvent);
    });

    it('should throw ConflictException on duplicate slug', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);

      await expect(
        service.create({
          title: 'x',
          slug: 'health-talk',
          description: 'x',
          date: '2026-06-01',
          location: 'x',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update event', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.event.findFirst.mockResolvedValue(null);
      mockPrisma.event.update.mockResolvedValue({ ...mockEvent, title: '新標題' });

      const result = await service.update('evt-1', { title: '新標題' });
      expect(result.title).toBe('新標題');
    });

    it('should throw ConflictException on duplicate slug', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.event.findFirst.mockResolvedValue({ id: 'other' });

      await expect(
        service.update('evt-1', { slug: 'taken' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete event', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.event.delete.mockResolvedValue(mockEvent);

      await expect(service.remove('evt-1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await expect(service.remove('nope')).rejects.toThrow(NotFoundException);
    });
  });
});
