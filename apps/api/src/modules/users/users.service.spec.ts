import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const user = { id: '1', email: 'test@test.com', password: 'hashed' };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('test@test.com');
      expect(result).toEqual(user);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should return null when not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('noone@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user = { id: '1', email: 'test@test.com' };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findById('1');
      expect(result).toEqual(user);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null when not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pw');
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        email: 'new@test.com',
        password: 'hashed_pw',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create({
        email: 'new@test.com',
        password: 'plaintext',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('plaintext', 12);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@test.com',
          password: 'hashed_pw',
          role: 'ADMIN',
        },
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'dup@test.com' });

      await expect(
        service.create({ email: 'dup@test.com', password: 'pw' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should use provided role', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockPrisma.user.create.mockResolvedValue({
        id: '2',
        email: 'editor@test.com',
        password: 'hashed',
        role: 'EDITOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await service.create({
        email: 'editor@test.com',
        password: 'pw',
        role: 'EDITOR' as any,
      });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'editor@test.com',
          password: 'hashed',
          role: 'EDITOR',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return users without passwords', async () => {
      mockPrisma.user.findMany.mockResolvedValue([
        { id: '1', email: 'a@a.com', password: 'secret', role: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', email: 'b@b.com', password: 'secret2', role: 'EDITOR', createdAt: new Date(), updatedAt: new Date() },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      result.forEach((u) => {
        expect(u).not.toHaveProperty('password');
      });
    });

    it('should order by createdAt desc', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);

      await service.findAll();
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
