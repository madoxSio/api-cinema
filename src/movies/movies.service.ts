import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    this.logger.log('This action adds a new movie');
    this.logger.debug(`Received data: ${JSON.stringify(createMovieDto)}`);

    try {
      const newMovie = await this.prisma.movie.create({
        data: createMovieDto,
      });

      return newMovie;
    } catch (error) {
      this.logger.error('Error while creating movie', error.stack);
      throw new InternalServerErrorException('Failed to create movie');
    }
  }

  async findAll() {
    this.logger.log('This action returns all movies');

    try {
      const movies = await this.prisma.movie.findMany();
      return movies;
    } catch (error) {
      this.logger.error('Error while fetching all movies', error.stack);
      throw new InternalServerErrorException('Failed to fetch movies');
    }
  }

  async findOne(id: number) {
    this.logger.log(`This action returns movie #${id}`);

    try {
      const movie = await this.prisma.movie.findUnique({
        where: { id },
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }

      return movie;
    } catch (error) {
      this.logger.error(`Error fetching movie #${id}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while fetching the movie');
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    this.logger.log(`This action updates movie #${id}`);
    this.logger.debug(`Received data: ${JSON.stringify(updateMovieDto)}`);

    try {
      const existing = await this.prisma.movie.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }

      const updatedMovie = await this.prisma.movie.update({
        where: { id },
        data: updateMovieDto,
      });

      return updatedMovie;
    } catch (error) {
      this.logger.error(`Error updating movie #${id}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update movie');
    }
  }

  async remove(id: number) {
    this.logger.log(`This action removes movie #${id}`);

    try {
      const existing = await this.prisma.movie.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }

      await this.prisma.movie.delete({
        where: { id },
      });

      return { message: `Movie with ID ${id} has been successfully deleted.` };
    } catch (error) {
      this.logger.error(`Error deleting movie #${id}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete movie');
    }
  }
}
