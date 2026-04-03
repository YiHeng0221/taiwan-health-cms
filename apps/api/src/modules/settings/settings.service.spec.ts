import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockSettings = {
  id: 'default',
  siteName: '台灣健康',
  logo: null,
  favicon: null,
  footer: null,
  social: null,
  contact: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  siteSettings: {
    findUnique: jest.fn(),
    create: jest.fn(),
    upsert: jest.fn(),
  },
};

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return existing settings', async () => {
      mockPrisma.siteSettings.findUnique.mockResolvedValue(mockSettings);

      const result = await service.get();
      expect(result).toEqual(mockSettings);
    });

    it('should create default settings if none exist', async () => {
      mockPrisma.siteSettings.findUnique.mockResolvedValue(null);
      mockPrisma.siteSettings.create.mockResolvedValue(mockSettings);

      const result = await service.get();
      expect(result).toEqual(mockSettings);
      expect(mockPrisma.siteSettings.create).toHaveBeenCalledWith({
        data: { id: 'default' },
      });
    });
  });

  describe('update', () => {
    it('should update site name', async () => {
      const updated = { ...mockSettings, siteName: '新名稱' };
      mockPrisma.siteSettings.upsert.mockResolvedValue(updated);

      const result = await service.update({ siteName: '新名稱' });
      expect(result.siteName).toBe('新名稱');
    });

    it('should upsert with default id', async () => {
      mockPrisma.siteSettings.upsert.mockResolvedValue(mockSettings);

      await service.update({ siteName: 'x' });
      expect(mockPrisma.siteSettings.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'default' },
        }),
      );
    });
  });
});
