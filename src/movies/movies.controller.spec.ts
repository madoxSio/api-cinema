import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getMovieOnPeriod: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        { provide: MoviesService, useValue: mockMoviesService },
        PrismaService, // Si nécessaire, on peut aussi mocker PrismaService.
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const dto: CreateMovieDto = {
        title: 'New Movie',
        description: 'A description of the movie',
        year: 2025,
        age_min: 13,
        duration: 120,
      };

      const result = { id: 1, ...dto };

      mockMoviesService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockMoviesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const result = [{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }];

      mockMoviesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockMoviesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      const result = { id: 1, title: 'Movie 1' };

      mockMoviesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if movie not found', async () => {
      mockMoviesService.findOne.mockRejectedValue(new NotFoundException('Movie not found'));

      try {
        await controller.findOne(99);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe('Movie not found');
      }
    });
  });

  describe('update', () => {
    it('should update the movie details', async () => {
      const dto: UpdateMovieDto = { title: 'Updated Movie' };
      const result = { id: 1, title: 'Updated Movie' };

      mockMoviesService.update.mockResolvedValue(result);

      expect(await controller.update(1, dto)).toEqual(result);
      expect(mockMoviesService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw an error if movie not found when updating', async () => {
      const dto: UpdateMovieDto = { title: 'Updated Movie' };

      mockMoviesService.update.mockRejectedValue(new NotFoundException('Movie not found'));

      try {
        await controller.update(99, dto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe('Movie not found');
      }
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      const result = { message: 'Movie with ID 1 has been successfully deleted.' };

      mockMoviesService.remove.mockResolvedValue(result);

      expect(await controller.remove(1)).toEqual(result);
      expect(mockMoviesService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an error if movie not found when deleting', async () => {
      mockMoviesService.remove.mockRejectedValue(new NotFoundException('Movie not found'));

      try {
        await controller.remove(99);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe('Movie not found');
      }
    });
  });

  describe('getMovieSchedule', () => {
    it('should return movie schedule for a given period', async () => {
      const start = '2025-01-01T00:00:00Z';
      const end = '2025-12-31T23:59:59Z';
      const movieTitle = 'Test Movie';

      const result = [{ id: 1, movieId: 1, date: '2025-01-01T10:00:00Z' }];

      mockMoviesService.getMovieOnPeriod.mockResolvedValue(result);

      expect(await controller.getMovieSchedule(start, end, movieTitle)).toEqual(result);
      expect(mockMoviesService.getMovieOnPeriod).toHaveBeenCalledWith(start, end, movieTitle);
    });
  });
});
