import { Test, TestingModule } from '@nestjs/testing';
import { MovieTheatersService } from './movie-theaters.service';

describe('MovieTheatersService', () => {
  let service: MovieTheatersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieTheatersService],
    }).compile();

    service = module.get<MovieTheatersService>(MovieTheatersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
