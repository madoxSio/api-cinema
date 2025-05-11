import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '../prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let prisma: PrismaService;

  const mockPrisma = {
    movie: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
    screening: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const dto: CreateMovieDto = {
        title: 'Test Movie',
        description: 'This is a test movie description',
        year: 2025,
        age_min: 13,
        duration: 120,
      };
      const result = { id: 1, ...dto };

      mockPrisma.movie.create.mockResolvedValue(result);

      expect(await service.create(dto)).toEqual(result);
      expect(mockPrisma.movie.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const dto: CreateMovieDto = {
        title: 'Test Movie',
        description: 'This is a test movie description',
        year: 2025,
        age_min: 13,
        duration: 120,
      };
      mockPrisma.movie.create.mockRejectedValue(new Error('Error'));

      await expect(service.create(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const result = [{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }];
      mockPrisma.movie.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(mockPrisma.movie.findMany).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.movie.findMany.mockRejectedValue(new Error('Error'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      const result = { id: 1, title: 'Movie 1' };
      mockPrisma.movie.findUnique.mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
      expect(mockPrisma.movie.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if movie is not found', async () => {
      mockPrisma.movie.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.movie.findUnique.mockRejectedValue(new Error('Error'));

      await expect(service.findOne(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update and return the movie', async () => {
      const dto: UpdateMovieDto = { title: 'Updated Movie', duration: 130 };
      const result = { id: 1, ...dto };

      mockPrisma.movie.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.movie.update.mockResolvedValue(result);

      expect(await service.update(1, dto)).toEqual(result);
      expect(mockPrisma.movie.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const dto: UpdateMovieDto = { title: 'Updated Movie', duration: 130 };
      mockPrisma.movie.findUnique.mockResolvedValue(null);

      await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const dto: UpdateMovieDto = { title: 'Updated Movie', duration: 130 };
      mockPrisma.movie.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.movie.update.mockRejectedValue(new Error('Error'));

      await expect(service.update(1, dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should delete the movie', async () => {
      const result = { message: 'Movie with ID 1 has been successfully deleted.' };
      mockPrisma.movie.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.movie.delete.mockResolvedValue(result);

      expect(await service.remove(1)).toEqual(result);
      expect(mockPrisma.movie.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if movie is not found', async () => {
      mockPrisma.movie.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.movie.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.movie.delete.mockRejectedValue(new Error('Error'));

      await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getMovieOnPeriod', () => {
    it('should return screenings for a movie within the given period', async () => {
      const movieTitle = 'Test Movie';
      const start = '2025-05-11T10:00:00Z';
      const end = '2025-05-11T18:00:00Z';

      const movie = { id: 1, title: movieTitle };
      const screenings = [{ id: 1, movieId: 1, date: start }];
      mockPrisma.movie.findFirst.mockResolvedValue(movie);
      mockPrisma.screening.findMany.mockResolvedValue(screenings);

      const result = await service.getMovieOnPeriod(start, end, movieTitle);
      expect(result).toEqual(screenings);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      mockPrisma.movie.findFirst.mockResolvedValue(null);

      await expect(service.getMovieOnPeriod('2025-05-11T10:00:00Z', '2025-05-11T18:00:00Z', 'Test Movie'))
        .rejects.toThrow(NotFoundException);
    });

    
  });
});
