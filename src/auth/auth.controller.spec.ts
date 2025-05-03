import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
import { JwtPayload } from './interfaces/jwt-payload.interface';

interface MockRequest {
  user: {
    sub: string;
    role: string;
  };
}

describe('AuthController', () => {
  let controller: AuthController;
  let service: Partial<AuthService>;

  beforeEach(async () => {
    service = {
      register: jest
        .fn()
        .mockResolvedValue({ id: '1', email: 'test@test.com' }),
      login: jest
        .fn()
        .mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh' }),
      refresh: jest.fn().mockResolvedValue({
        accessToken: 'new_token',
        refreshToken: 'new_refresh',
      }),
      logout: jest.fn().mockResolvedValue(undefined),
      validateUser: jest
        .fn()
        .mockResolvedValue({ id: '1', email: 'test@test.com', role: 'CLIENT' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: service }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register user', async () => {
    const result = await controller.register({
      email: 'test@test.com',
      password: '1234',
    });
    expect(result).toHaveProperty('email');
    expect(result.email).toBe('test@test.com');
    expect(service.register).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '1234',
    });
  });

  it('should login user and return tokens', async () => {
    const result = await controller.login({
      email: 'test@test.com',
      password: '1234',
    });
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('should refresh token', async () => {
    const result = await controller.refresh('refresh-token');
    expect(result.accessToken).toBe('new_token');
  });

  it('should logout user', async () => {
    const mockRequest = {
      user: {
        sub: '1',
        role: Role.CLIENT,
      },
    } as Request & { user: JwtPayload };

    await expect(controller.logout(mockRequest)).resolves.toBeUndefined();
  });
});
