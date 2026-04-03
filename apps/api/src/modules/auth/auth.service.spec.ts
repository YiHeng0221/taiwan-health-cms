import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  password: 'hashed_password',
  role: 'ADMIN',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return auth response on valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({ email: 'admin@test.com', password: 'correct' });

      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.user.email).toBe('admin@test.com');
      expect(result.user).not.toHaveProperty('password');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'admin@test.com',
        role: 'ADMIN',
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'no@one.com', password: 'pw' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'admin@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateToken', () => {
    it('should return user without password when valid', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.validateToken({
        sub: 'user-1',
        email: 'admin@test.com',
        role: 'ADMIN' as any,
        iat: 0,
        exp: 0,
      });

      expect(result).not.toBeNull();
      expect(result!.email).toBe('admin@test.com');
    });

    it('should return null when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      const result = await service.validateToken({
        sub: 'gone',
        email: 'x@x.com',
        role: 'ADMIN' as any,
        iat: 0,
        exp: 0,
      });

      expect(result).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user without password', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.getCurrentUser('user-1');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('user-1');
    });

    it('should return null when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      const result = await service.getCurrentUser('gone');
      expect(result).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should issue a new token for authenticated user', async () => {
      const user = { id: 'user-1', email: 'admin@test.com', role: 'ADMIN' as any, createdAt: new Date() };

      const result = await service.refreshToken(user);
      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.user).toEqual(user);
    });
  });
});
