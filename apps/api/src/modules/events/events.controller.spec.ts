import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

const mockEvent = {
  id: 'evt-1',
  title: '健康講座',
  slug: 'health-seminar',
  description: '描述',
  date: new Date(),
  location: '台北',
  images: [],
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPaginated = {
  items: [mockEvent],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

const mockService = {
  findAllPublished: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: mockService }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    jest.clearAllMocks();
  });

  describe('findAllPublished (public)', () => {
    it('should return published events', async () => {
      mockService.findAllPublished.mockResolvedValue(mockPaginated);

      const result = await controller.findAllPublished({ page: 1, pageSize: 10 });
      expect(result).toEqual(mockPaginated);
      expect(mockService.findAllPublished).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    });
  });

  describe('findAll (admin)', () => {
    it('should return all events', async () => {
      mockService.findAll.mockResolvedValue(mockPaginated);

      const result = await controller.findAll({ page: 1, pageSize: 10 });
      expect(result).toEqual(mockPaginated);
    });
  });

  describe('findById (admin)', () => {
    it('should return event by id', async () => {
      mockService.findById.mockResolvedValue(mockEvent);

      const result = await controller.findById('evt-1');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('findBySlug (public)', () => {
    it('should return event by slug', async () => {
      mockService.findBySlug.mockResolvedValue(mockEvent);

      const result = await controller.findBySlug('health-seminar');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('create', () => {
    it('should create event', async () => {
      mockService.create.mockResolvedValue(mockEvent);

      const dto = {
        title: '健康講座',
        slug: 'health-seminar',
        description: '描述',
        date: '2026-05-01',
        location: '台北',
      };
      const result = await controller.create(dto as any);
      expect(result).toEqual(mockEvent);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update event', async () => {
      const updated = { ...mockEvent, title: '更新' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('evt-1', { title: '更新' } as any);
      expect(result.title).toBe('更新');
    });
  });

  describe('remove', () => {
    it('should delete event and return message', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('evt-1');
      expect(result).toEqual({ message: '活動已刪除' });
    });
  });
});
