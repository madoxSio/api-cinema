import { Test, TestingModule } from '@nestjs/testing';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';
import { CreateScreeningDTO } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';

describe('ScreeningController', () => {
  let controller: ScreeningController;
  let service: ScreeningService;

  const mockScreeningService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreeningController],
      providers: [
        {
          provide: ScreeningService,
          useValue: mockScreeningService,
        },
      ],
    }).compile();

    controller = module.get<ScreeningController>(ScreeningController);
    service = module.get<ScreeningService>(ScreeningService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const dto: CreateScreeningDTO = {
        start: '14:00',
        end: '16:00',
        date: new Date().toISOString(),
        movieId: 1,
        movieTheaterId: 2,
        nb_ticket: 0
      };

      const result = { id: 1, ...dto };

      mockScreeningService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of screenings', async () => {
      const result = [{ id: 1 }, { id: 2 }];
      mockScreeningService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single screening by ID', async () => {
      const result = { id: 1 };
      mockScreeningService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update and return the updated screening', async () => {
      const dto: UpdateScreeningDto = { start: '15:00' };
      const result = { id: 1, ...dto };

      mockScreeningService.update.mockResolvedValue(result);

      expect(await controller.update(1, dto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct ID', async () => {
      mockScreeningService.remove.mockResolvedValue({ deleted: true });

      expect(await controller.remove(1)).toEqual({ deleted: true });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
