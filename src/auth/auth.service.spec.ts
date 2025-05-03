import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let prismaService: Partial<Record<keyof PrismaService, any>>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
        role: 'CLIENT',
      }),
      findOne: jest.fn().mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
        role: 'CLIENT',
      }),
      create: jest.fn().mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
        role: 'CLIENT',
      }),
    };

    prismaService = {
      refreshToken: {
        create: jest.fn(),
      },
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-access-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user with correct credentials', async () => {
    const user = await service.validateUser('test@test.com', 'password');
    expect(user).toBeDefined();
    expect(user.email).toBe('test@test.com');
  });

  it('should throw error with wrong credentials', async () => {
    await expect(
      service.validateUser('test@test.com', 'wrongpassword'),
    ).rejects.toThrow();
  });

  it('should return access and refresh tokens on login', async () => {
    const user = await service.validateUser('test@test.com', 'password');
    const tokens = await service.login(user);
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });
});
