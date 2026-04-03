import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  role: 'ADMIN',
};

const mockLoginResult = {
  accessToken: 'jwt-token',
  user: mockUser,
};

const mockService = {
  login: jest.fn(),
  refreshToken: jest.fn(),
};

const mockResponse = () => {
  const res: any = {};
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should set cookie and return user', async () => {
      mockService.login.mockResolvedValue(mockLoginResult);
      const res = mockResponse();

      const result = await controller.login(
        { email: 'admin@test.com', password: 'password123' },
        res,
      );

      expect(result).toEqual({ user: mockUser, message: '登入成功' });
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'jwt-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
        }),
      );
    });
  });

  describe('logout', () => {
    it('should clear cookie and return message', async () => {
      const res = mockResponse();

      const result = await controller.logout(res);

      expect(result).toEqual({ message: '登出成功' });
      expect(res.clearCookie).toHaveBeenCalledWith('access_token', { path: '/' });
    });
  });

  describe('me', () => {
    it('should return current user', async () => {
      const result = await controller.me(mockUser as any);
      expect(result).toEqual({ user: mockUser });
    });
  });

  describe('refresh', () => {
    it('should refresh token and set new cookie', async () => {
      mockService.refreshToken.mockResolvedValue(mockLoginResult);
      const res = mockResponse();

      const result = await controller.refresh(mockUser as any, res);

      expect(result).toEqual({ user: mockUser, message: 'Token 已更新' });
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'jwt-token',
        expect.objectContaining({ httpOnly: true }),
      );
    });
  });
});
