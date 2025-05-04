import { Test, TestingModule } from '@nestjs/testing';
import { MovieTheatersService } from './movie-theaters.service';
import { PrismaService } from '../prisma.service';

describe('MovieTheatersService', () => {
  let service: MovieTheatersService;
  let prismaService: {
    movieTheater: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    movieTheaterPhoto: {
      createMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaService = {
      movieTheater: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn().mockReturnValue({
          id: 1,
          name: 'Test Theater',
          description: 'A test theater',
          type: 'IMAX',
          capacity: 100,
          photos: [
            { id: 1, url: 'photo1.jpg' },
            { id: 2, url: 'photo2.jpg' },
          ],
        }),
        update: jest.fn().mockReturnValue({
          id: 1,
          name: 'Updated Theater',
          description: 'An updated theater',
          type: 'IMAX',
          capacity: 150,
        }),
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
      description: 'A updated theater',
      type: 'IMAX',
      capacity: 100,
      photos: ['photo1.jpg', 'photo2.jpg'],
    };

    const createdMovieTheater = {
      id: 1,
      ...createMovieTheaterDto,
    };

    prismaService.movieTheater.create.mockResolvedValue(createdMovieTheater);
    prismaService.movieTheaterPhoto.createMany.mockResolvedValue({});

    const result = await service.create(createMovieTheaterDto);

    expect(result).toEqual(createdMovieTheater);
    expect(prismaService.movieTheater.create).toHaveBeenCalledWith({
      data: {
        name: createMovieTheaterDto.name,
        description: createMovieTheaterDto.description,
        type: createMovieTheaterDto.type,
        capacity: createMovieTheaterDto.capacity,
      },
    });
    expect(prismaService.movieTheaterPhoto.createMany).toHaveBeenCalledWith({
      data: createMovieTheaterDto.photos.map((photo) => ({
        movieTheaterId: createdMovieTheater.id,
        url: photo,
      })),
    });
  });

  it('should find all movie theaters', async () => {
    const movieTheatersEntry = [
      { id: 1, name: 'Theater 1', photos: [] },
      {
        id: 2,
        name: 'Theater 2',
        photos: [
          {
            id: 1,
            url: 'photo1.jpg',
          },
          {
            id: 2,
            url: 'photo2.jpg',
          },
        ],
      },
    ];

    const movieTheatersResult = movieTheatersEntry.map((movieTheater) => ({
      ...movieTheater,
      photos: movieTheater.photos
        ? movieTheater.photos.map((photo) => photo.url)
        : [],
    }));

    prismaService.movieTheater.findMany.mockResolvedValue(movieTheatersEntry);

    const result = await service.findAll();

    expect(result).toEqual(movieTheatersResult);
    expect(prismaService.movieTheater.findMany).toHaveBeenCalled();
  });

  it('should find a movie theater by id', async () => {
    const movieTheater = {
      id: 1,
      name: 'Test Theater',
      description: 'A test theater',
      type: 'IMAX',
      capacity: 100,
      photos: [
        { id: 1, url: 'photo1.jpg' },
        { id: 2, url: 'photo2.jpg' },
      ],
    };

    const movieTheaterResult = {
      ...movieTheater,
      photos: movieTheater.photos
        ? movieTheater.photos.map((photo) => photo.url)
        : [],
    };

    prismaService.movieTheater.findUnique.mockResolvedValue(movieTheater);

    const result = await service.findOne(1);

    expect(result).toEqual(movieTheaterResult);
    expect(prismaService.movieTheater.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        photos: true,
      },
    });
  });
});
