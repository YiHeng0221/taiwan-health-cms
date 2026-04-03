import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  role: 'ADMIN',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockService = {
  findAll: jest.fn(),
  create: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('create', () => {
    it('should create user with validated DTO', async () => {
      mockService.create.mockResolvedValue(mockUser);

      const result = await controller.create({
        email: 'new@test.com',
        password: 'password123',
        role: 'ADMIN' as any,
      });

      expect(result).toEqual(mockUser);
      expect(mockService.create).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'password123',
        role: 'ADMIN',
      });
    });
  });
});
