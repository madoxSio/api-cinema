import { Test, TestingModule } from '@nestjs/testing';
import { MoneyService } from './money.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MoneyService', () => {
  let service: MoneyService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoneyService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<MoneyService>(MoneyService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getBalance()', () => {
    it('should return the user balance', async () => {
      const user = { id: '1', balance: 50 };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.getBalance('1');
      expect(result).toEqual({ balance: 50 });
    });

    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getBalance('404')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deposit()', () => {
    it('should deposit money and return new balance', async () => {
      const user = { id: '1', balance: 20 };
      const updatedUser = { ...user, balance: 70 };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.$transaction.mockResolvedValue([null, updatedUser]);

      const result = await service.deposit('1', 50);
      expect(result).toEqual({ newBalance: 70 });
    });

    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.deposit('404', 10)).rejects.toThrow(NotFoundException);
    });
  });

  describe('withdraw()', () => {
    it('should withdraw money and return new balance', async () => {
      const user = { id: '1', balance: 100 };
      const updatedUser = { ...user, balance: 80 };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.$transaction.mockResolvedValue([null, updatedUser]);

      const result = await service.withdraw('1', 20);
      expect(result).toEqual({ newBalance: 80 });
    });

    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.withdraw('404', 20)).rejects.toThrow(NotFoundException);
    });

    it('should throw if insufficient funds', async () => {
      const user = { id: '1', balance: 5 };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      await expect(service.withdraw('1', 10)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTransactions()', () => {
    it('should return transaction history', async () => {
      const user = { id: '1' };
      const transactions = [{ id: 1 }, { id: 2 }];

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.transaction.findMany.mockResolvedValue(transactions);

      const result = await service.getTransactions('1');
      expect(result).toEqual(transactions);
    });

    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getTransactions('404')).rejects.toThrow(NotFoundException);
    });
  });
});