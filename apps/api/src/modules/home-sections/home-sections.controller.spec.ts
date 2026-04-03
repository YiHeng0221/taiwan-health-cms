import { Test, TestingModule } from '@nestjs/testing';
import { HomeSectionsController } from './home-sections.controller';
import { HomeSectionsService } from './home-sections.service';

const mockSection = {
  id: 'hs-1',
  type: 'hero',
  config: { title: '歡迎' },
  order: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockService = {
  findAllActive: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  reorder: jest.fn(),
  remove: jest.fn(),
};

describe('HomeSectionsController', () => {
  let controller: HomeSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeSectionsController],
      providers: [{ provide: HomeSectionsService, useValue: mockService }],
    }).compile();

    controller = module.get<HomeSectionsController>(HomeSectionsController);
    jest.clearAllMocks();
  });

  describe('findAllActive (public)', () => {
    it('should return active sections', async () => {
      mockService.findAllActive.mockResolvedValue([mockSection]);

      const result = await controller.findAllActive();
      expect(result).toEqual([mockSection]);
    });
  });

  describe('findAll (admin)', () => {
    it('should return all sections', async () => {
      mockService.findAll.mockResolvedValue([mockSection]);

      const result = await controller.findAll();
      expect(result).toEqual([mockSection]);
    });
  });

  describe('findById', () => {
    it('should return section by id', async () => {
      mockService.findById.mockResolvedValue(mockSection);

      const result = await controller.findById('hs-1');
      expect(result).toEqual(mockSection);
    });
  });

  describe('create', () => {
    it('should create section', async () => {
      mockService.create.mockResolvedValue(mockSection);

      const result = await controller.create({ type: 'hero', config: { title: '歡迎' } } as any);
      expect(result).toEqual(mockSection);
    });
  });

  describe('update', () => {
    it('should update section', async () => {
      const updated = { ...mockSection, type: 'banner' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('hs-1', { type: 'banner' } as any);
      expect(result.type).toBe('banner');
    });
  });

  describe('reorder', () => {
    it('should reorder sections', async () => {
      mockService.reorder.mockResolvedValue([mockSection]);

      const result = await controller.reorder({ orderedIds: ['hs-2', 'hs-1'] });
      expect(result).toEqual([mockSection]);
      expect(mockService.reorder).toHaveBeenCalledWith(['hs-2', 'hs-1']);
    });
  });

  describe('remove', () => {
    it('should delete section and return message', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('hs-1');
      expect(result).toEqual({ message: '區塊已刪除' });
    });
  });
});
