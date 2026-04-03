import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockContact = {
  id: 'ct-1',
  name: '王小明',
  email: 'wang@test.com',
  phone: '0912345678',
  message: '想了解健康檢查',
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  contactSubmission: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create contact submission', async () => {
      mockPrisma.contactSubmission.create.mockResolvedValue(mockContact);

      const result = await service.create({
        name: '王小明',
        email: 'wang@test.com',
        phone: '0912345678',
        subject: '健康檢查諮詢',
        message: '想了解健康檢查',
      });

      expect(result).toEqual(mockContact);
    });
  });

  describe('findAll', () => {
    it('should return paginated contacts', async () => {
      mockPrisma.contactSubmission.count.mockResolvedValue(1);
      mockPrisma.contactSubmission.findMany.mockResolvedValue([mockContact]);

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should filter by isRead', async () => {
      mockPrisma.contactSubmission.count.mockResolvedValue(0);
      mockPrisma.contactSubmission.findMany.mockResolvedValue([]);

      await service.findAll({ page: 1, pageSize: 10, isRead: false });

      const countWhere = mockPrisma.contactSubmission.count.mock.calls[0][0].where;
      expect(countWhere.isRead).toBe(false);
    });
  });

  describe('findById', () => {
    it('should return contact', async () => {
      mockPrisma.contactSubmission.findUnique.mockResolvedValue(mockContact);

      const result = await service.findById('ct-1');
      expect(result).toEqual(mockContact);
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.contactSubmission.findUnique.mockResolvedValue(null);

      await expect(service.findById('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsRead', () => {
    it('should mark contact as read', async () => {
      mockPrisma.contactSubmission.findUnique.mockResolvedValue(mockContact);
      mockPrisma.contactSubmission.update.mockResolvedValue({ ...mockContact, isRead: true });

      const result = await service.markAsRead('ct-1');
      expect(result.isRead).toBe(true);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.contactSubmission.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete contact', async () => {
      mockPrisma.contactSubmission.findUnique.mockResolvedValue(mockContact);
      mockPrisma.contactSubmission.delete.mockResolvedValue(mockContact);

      await expect(service.remove('ct-1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.contactSubmission.findUnique.mockResolvedValue(null);

      await expect(service.remove('nope')).rejects.toThrow(NotFoundException);
    });
  });
});
