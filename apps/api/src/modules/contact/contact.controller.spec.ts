import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

const mockContact = {
  id: 'contact-1',
  name: '測試',
  email: 'test@test.com',
  phone: '0912345678',
  message: '測試訊息',
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPaginated = {
  items: [mockContact],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  markAsRead: jest.fn(),
  remove: jest.fn(),
};

describe('ContactController', () => {
  let controller: ContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [{ provide: ContactService, useValue: mockService }],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    jest.clearAllMocks();
  });

  describe('create (public)', () => {
    it('should create contact and return success message', async () => {
      mockService.create.mockResolvedValue(mockContact);

      const result = await controller.create({
        name: '測試',
        email: 'test@test.com',
        message: '測試訊息',
      } as any);

      expect(result).toEqual({ message: '感謝您的來信，我們會盡快回覆您！' });
      expect(mockService.create).toHaveBeenCalled();
    });
  });

  describe('findAll (admin)', () => {
    it('should return paginated contacts', async () => {
      mockService.findAll.mockResolvedValue(mockPaginated);

      const result = await controller.findAll({ page: 1, pageSize: 10 });
      expect(result).toEqual(mockPaginated);
    });
  });

  describe('markAsRead', () => {
    it('should mark contact as read', async () => {
      const readContact = { ...mockContact, isRead: true };
      mockService.markAsRead.mockResolvedValue(readContact);

      const result = await controller.markAsRead('contact-1');
      expect(result.isRead).toBe(true);
    });
  });

  describe('remove', () => {
    it('should delete contact and return message', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('contact-1');
      expect(result).toEqual({ message: '訊息已刪除' });
    });
  });
});
