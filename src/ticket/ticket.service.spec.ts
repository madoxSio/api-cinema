import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTicketDto, TypeTicket } from './dto/create-ticket.dto';

describe('TicketService', () => {
  let service: TicketService;
  let prisma: PrismaService;

  const mockPrisma = {
    $transaction: jest.fn(),
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    ticket: {
      create: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    const userId = 'user-123';
    const dto: CreateTicketDto = { type: TypeTicket.STANDARD };

    it('should throw if user not found', async () => {
      mockPrisma.$transaction.mockImplementationOnce((cb) =>
        cb({
          user: { findUnique: () => null },
        }),
      );

      await expect(service.create(dto, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw if insufficient funds', async () => {
      mockPrisma.$transaction.mockImplementationOnce((cb) =>
        cb({
          user: {
            findUnique: () => ({ id: userId, balance: 5 }), // less than 8
          },
        }),
      );

      await expect(service.create(dto, userId)).rejects.toThrow(BadRequestException);
    });

    it('should create ticket and deduct funds if balance is sufficient', async () => {
      const mockUser = { id: userId, balance: 20 };
      const mockTicket = { id: 1, userId, type: 'STANDARD' };

      mockPrisma.$transaction.mockImplementationOnce((cb) =>
        cb({
          user: {
            findUnique: () => mockUser,
            update: jest.fn().mockResolvedValue({ ...mockUser, balance: 12 }),
          },
          ticket: {
            create: jest.fn().mockResolvedValue(mockTicket),
          },
          transaction: {
            create: jest.fn(),
          },
        }),
      );

      const result = await service.create(dto, userId);
      expect(result).toEqual(mockTicket);
    });
  });
});
