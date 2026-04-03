import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

const mockService_ = {
  id: 'svc-1',
  title: '健康檢查',
  slug: 'health-check',
  description: '描述',
  icon: 'activity',
  image: null,
  features: [],
  order: 0,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPaginated = {
  items: [mockService_],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

const mockServicesService = {
  findAllActive: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ServicesController', () => {
  let controller: ServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [{ provide: ServicesService, useValue: mockServicesService }],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    jest.clearAllMocks();
  });

  describe('findAllActive (public)', () => {
    it('should return active services', async () => {
      mockServicesService.findAllActive.mockResolvedValue([mockService_]);

      const result = await controller.findAllActive();
      expect(result).toEqual([mockService_]);
    });
  });

  describe('findAll (admin)', () => {
    it('should return paginated services', async () => {
      mockServicesService.findAll.mockResolvedValue(mockPaginated);

      const result = await controller.findAll({ page: 1, pageSize: 10 });
      expect(result).toEqual(mockPaginated);
    });
  });

  describe('findOne (admin)', () => {
    it('should return service by id', async () => {
      mockServicesService.findOne.mockResolvedValue(mockService_);

      const result = await controller.findOne('svc-1');
      expect(result).toEqual(mockService_);
    });
  });

  describe('create', () => {
    it('should create service', async () => {
      mockServicesService.create.mockResolvedValue(mockService_);

      const result = await controller.create({ title: '健康檢查', slug: 'health-check' } as any);
      expect(result).toEqual(mockService_);
    });
  });

  describe('update', () => {
    it('should update service', async () => {
      const updated = { ...mockService_, title: '更新' };
      mockServicesService.update.mockResolvedValue(updated);

      const result = await controller.update('svc-1', { title: '更新' } as any);
      expect(result.title).toBe('更新');
    });
  });

  describe('remove', () => {
    it('should delete service', async () => {
      mockServicesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('svc-1');
      expect(result).toBeUndefined();
    });
  });
});
