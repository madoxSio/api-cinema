import { Test, TestingModule } from '@nestjs/testing';
import { MovieTheatersService } from './movie-theaters.service';
import { MovieTheatersController } from './movie-theaters.controller';
import { CreateMovieTheaterDto } from './dto/create-movie-theater.dto';

describe('MovieTheatersController', () => {
  let controller: MovieTheatersController;
  let service: Partial<MovieTheatersService>;
  const mockMovieTheater = {
    id: 1,
    name: 'Test Theater',
    description: 'A test movie theater',
    type: 'IMAX',
    capacity: 27,
    hasDisabledAccess: true,
    photos: ['photo1.jpg', 'photo2.jpg'],
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockResolvedValue([
        mockMovieTheater,
        {
          id: 2,
          name: 'Another Theater',
          description: 'Another test movie theater',
          type: 'Standard',
          capacity: 100,
          isUnderMaintenance: true,
          photos: ['photo3.jpg', 'photo4.jpg'],
        },
      ]),
      findOne: jest.fn().mockResolvedValue(mockMovieTheater),
      create: jest.fn().mockResolvedValue(mockMovieTheater),
      update: jest.fn().mockResolvedValue({
        ...mockMovieTheater,
        name: 'Updated Theater',
      }),
      remove: jest.fn().mockResolvedValue(mockMovieTheater),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieTheatersController],
      providers: [{ provide: MovieTheatersService, useValue: service }],
    }).compile();

    controller = module.get<MovieTheatersController>(MovieTheatersController);
  });

  it('it should create a movie theater', async () => {
    const createMovieTheaterDto: CreateMovieTheaterDto = {
      name: 'Test Theater',
      description: 'A test movie theater',
      type: 'IMAX',
      capacity: 27,
      photos: ['photo1.jpg', 'photo2.jpg'],
    };

    const result = await controller.create(createMovieTheaterDto);

    expect(service.create).toHaveBeenCalledWith(createMovieTheaterDto);
    expect(result).toMatchObject(createMovieTheaterDto);
  });

  it('should return an array of movie theaters', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      mockMovieTheater,
      {
        id: 2,
        name: 'Another Theater',
        description: 'Another test movie theater',
        type: 'Standard',
        capacity: 100,
        isUnderMaintenance: true,
        photos: ['photo3.jpg', 'photo4.jpg'],
      },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single movie theater', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockMovieTheater);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a movie theater', async () => {
    const result = await controller.update('1', {
      name: 'Updated Theater',
    });
    expect(service.update).toHaveBeenCalledWith(1, {
      name: 'Updated Theater',
    });
    expect(result).toEqual({
      id: 1,
      name: 'Updated Theater',
      description: 'A test movie theater',
      type: 'IMAX',
      capacity: 27,
      hasDisabledAccess: true,
      photos: ['photo1.jpg', 'photo2.jpg'],
    });
  });

  it('should delete a movie theater', async () => {
    const result = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockMovieTheater);
  });
});
