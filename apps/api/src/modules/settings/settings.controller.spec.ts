import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

const mockSettings = {
  id: 'settings-1',
  siteName: '樂頤生健康管理',
  logo: '/logo.png',
  social: {},
  footer: {},
  contact: {},
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockService = {
  get: jest.fn(),
  update: jest.fn(),
};

describe('SettingsController', () => {
  let controller: SettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [{ provide: SettingsService, useValue: mockService }],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    jest.clearAllMocks();
  });

  describe('get (public)', () => {
    it('should return site settings', async () => {
      mockService.get.mockResolvedValue(mockSettings);

      const result = await controller.get();
      expect(result).toEqual(mockSettings);
    });
  });

  describe('update (admin)', () => {
    it('should update settings', async () => {
      const updated = { ...mockSettings, siteName: '更新' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update({ siteName: '更新' } as any);
      expect(result.siteName).toBe('更新');
    });
  });
});
