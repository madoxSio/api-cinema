import { Test, TestingModule } from '@nestjs/testing';
import { MovieTheatersService } from './movie-theaters.service';
import { MovieTheatersController } from './movie-theaters.controller';
import { CreateMovieTheaterDto } from './dto/create-movie-theater.dto';

describe('MovieTheatersController', () => {
  let controller: MovieTheatersController;
  let service: Partial<MovieTheatersService>;

  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      remove: jest.fn().mockResolvedValue({}),
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

    await controller.create(createMovieTheaterDto);

    expect(service.create).toHaveBeenCalledWith(createMovieTheaterDto);
  });
});
