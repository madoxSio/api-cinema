import { Test, TestingModule } from '@nestjs/testing';
import { MovieTheatersService } from './movie-theaters.service';
import { PrismaService } from '../prisma.service';

describe('MovieTheatersService', () => {
  let service: MovieTheatersService;
  let prismaService: Partial<Record<keyof PrismaService, any>>;

  beforeEach(async () => {
    prismaService = {
      movieTheater: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      movieTheaterPhoto: {
        createMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieTheatersService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<MovieTheatersService>(MovieTheatersService);
  });

  it('should create a movie theater', async () => {
    const createMovieTheaterDto = {
      name: 'Test Theater',
      description: 'A test theater',
      type: 'IMAX',
      capacity: 100,
      photos: ['photo1.jpg', 'photo2.jpg'],
    };

    const createdMovieTheater = {
      id: 1,
      ...createMovieTheaterDto,
    };

    console.log('Mocked Prisma Service:', createdMovieTheater);

    prismaService.movieTheater.create.mockResolvedValue(createdMovieTheater);
    prismaService.movieTheaterPhoto.createMany.mockResolvedValue({});

    const result = await service.create(createMovieTheaterDto);

    expect(result).toEqual(createdMovieTheater);
    expect(prismaService.movieTheater.create).toHaveBeenCalledWith({
      data: {
        ...createMovieTheaterDto,
      },
    });
    expect(prismaService.movieTheaterPhoto.createMany).toHaveBeenCalledWith({
      data: createMovieTheaterDto.photos.map((photo) => ({
        movieTheaterId: createdMovieTheater.id,
        url: photo,
      })),
    });
  });
});
