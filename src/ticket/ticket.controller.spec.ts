import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma.service';
import { CreateTicketDto, CreateTicketUsageDto, TypeTicket } from './dto/create-ticket.dto';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';

describe('TicketController', () => {
  let controller: TicketController;
  let service: TicketService;

  const mockTicketService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    createTicketUsage: jest.fn(),
  };

  const mockUser = {
    sub: 'user-123',
    role: Role.CLIENT,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        { provide: TicketService, useValue: mockTicketService },
        PrismaService, // Optional if used directly elsewhere
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
    service = module.get<TicketService>(TicketService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call ticketService.create with correct arguments', async () => {
      const dto: CreateTicketDto = { type: TypeTicket.STANDARD };
      const expectedResult = { id: 1, type: 'STANDARD' };

      mockTicketService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(mockUser, dto);
      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(dto, mockUser.sub);
    });
  });

  describe('findOne()', () => {
    it('should return a ticket by ID for the current user', async () => {
      const ticketId = '5';
      const expectedTicket = { id: 5, userId: mockUser.sub };

      mockTicketService.findOne.mockResolvedValue(expectedTicket);

      const result = await controller.findOne(mockUser, ticketId);
      expect(result).toBe(expectedTicket);
      expect(service.findOne).toHaveBeenCalledWith(mockUser.sub, 5);
    });
  });

  describe('createTicketUsage()', () => {
    it('should use a ticket for a screening', async () => {
      const usageDto: CreateTicketUsageDto = {
        ticketId: 1,
        screeningId: 2,
      };
      const expectedUsage = { id: 999, ...usageDto };

      mockTicketService.createTicketUsage.mockResolvedValue(expectedUsage);

      const result = await controller.createTicketUsage(mockUser, usageDto);
      expect(result).toBe(expectedUsage);
      expect(service.createTicketUsage).toHaveBeenCalledWith(mockUser.sub, usageDto);
    });
  });
});
