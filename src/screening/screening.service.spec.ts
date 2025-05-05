import { Test, TestingModule } from '@nestjs/testing';
import { ScreeningService } from './screening.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScreeningDTO } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';

describe('ScreeningService', () => {
  let service: ScreeningService;
  let prisma: PrismaService;

  const mockPrisma = {
    screening: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScreeningService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ScreeningService>(ScreeningService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new screening', async () => {
      const dto: CreateScreeningDTO = {
        start: '14:00',
        end: '16:00',
        date: new Date(),
        movieId: 1,
        movieTheaterId: 2,
      };

      const result = { id: 1, ...dto };
      mockPrisma.screening.create.mockResolvedValue(result);

      expect(await service.create(dto)).toEqual(result);
      expect(mockPrisma.screening.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('should return all screenings', async () => {
      const result = [{ id: 1 }, { id: 2 }];
      mockPrisma.screening.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a screening by ID', async () => {
      const result = { id: 1 };
      mockPrisma.screening.findUnique.mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
      expect(mockPrisma.screening.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update and return the screening', async () => {
      const dto: UpdateScreeningDto = { start: '15:00' };
      const result = { id: 1, ...dto };

      mockPrisma.screening.update.mockResolvedValue(result);

      expect(await service.update(1, dto)).toEqual(result);
      expect(mockPrisma.screening.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('should delete the screening', async () => {
      const result = { id: 1 };
      mockPrisma.screening.delete.mockResolvedValue(result);

      expect(await service.remove(1)).toEqual(result);
      expect(mockPrisma.screening.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
