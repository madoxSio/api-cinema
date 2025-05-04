import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMovieTheaterDto as CreateMovieTheaterDto } from './dto/create-movie-theater.dto';
import { UpdateMovieTheaterDto as UpdateMovieTheaterDto } from './dto/update-movie-theater.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MovieTheatersService {
  private readonly logger = new Logger(MovieTheatersService.name);

  constructor(private prisma: PrismaService) {}

  async create(createMovieTheaterDto: CreateMovieTheaterDto) {
    this.logger.log('Creating a new movie theater hall');
    this.logger.debug(
      `Received data: ${JSON.stringify(createMovieTheaterDto)}`,
    );

    const { photos, ...movieTheaterData } = createMovieTheaterDto;

    const newMovieTheater = await this.prisma.movieTheater.create({
      data: movieTheaterData,
    });

    if (photos) {
      await this.prisma.movieTheaterPhoto.createMany({
        data: photos.map((photo) => ({
          movieTheaterId: newMovieTheater.id,
          url: photo,
        })),
      });
      newMovieTheater['photos'] = photos;
    }

    return newMovieTheater;
  }

  async findAll() {
    this.logger.log('Fetching all movie theater halls');

    const movieTheaters = await this.prisma.movieTheater.findMany({
      include: {
        photos: true,
      },
    });

    const result = movieTheaters.map((movieTheater) => ({
      ...movieTheater,
      photos: movieTheater.photos.map((photo) => photo.url),
    }));

    if (result.length === 0) {
      this.logger.warn('No movie theater halls found');
      throw new NotFoundException('Aucune salle de cinéma trouvée');
    }

    return result;
  }

  async findOne(id: number) {
    this.logger.log(`Fetching movie theater hall with ID: ${id}`);

    const movieTheater = await this.prisma.movieTheater.findUnique({
      where: { id },
      include: {
        photos: true,
      },
    });

    if (!movieTheater) {
      this.logger.warn(`Movie theater hall with ID: ${id} not found`);
      throw new NotFoundException(
        `Salle de cinéma avec l'ID ${id} non trouvée`,
      );
    }

    const result = {
      ...movieTheater,
      photos: movieTheater.photos.map((photo) => photo.url),
    };

    return result;
  }

  async update(id: number, updateMovieTheaterDto: UpdateMovieTheaterDto) {
    this.logger.log(`Updating movie theater hall with ID: ${id}`);
    this.logger.debug(
      `Received data: ${JSON.stringify(updateMovieTheaterDto)}`,
    );

    const { photos, ...movieTheaterData } = updateMovieTheaterDto;

    const movieTheater = await this.prisma.movieTheater.findUnique({
      where: { id },
    });

    if (!movieTheater) {
      this.logger.warn(`Movie theater hall with ID: ${id} not found`);
      throw new NotFoundException(
        `Salle de cinéma avec l'ID ${id} non trouvée`,
      );
    }

    await this.prisma.movieTheater.update({
      where: { id },
      data: movieTheaterData,
    });

    if (photos) {
      await this.prisma.movieTheaterPhoto.deleteMany({
        where: { movieTheaterId: id },
      });

      await this.prisma.movieTheaterPhoto.createMany({
        data: photos.map((photo) => ({
          movieTheaterId: id,
          url: photo,
        })),
      });
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    this.logger.log(`Removing movie theater hall with ID: ${id}`);

    const movieTheater = await this.prisma.movieTheater.findUnique({
      where: { id },
    });

    const movieTheaterPhotos = await this.prisma.movieTheaterPhoto.findMany({
      where: { movieTheaterId: id },
    });

    if (!movieTheater) {
      this.logger.warn(`Movie theater hall with ID: ${id} not found`);
      return null;
    }

    const movieTheaterDeleted = this.prisma.movieTheater.delete({
      where: { id },
    });

    if (movieTheaterPhotos) {
      await this.prisma.movieTheaterPhoto.deleteMany({
        where: { movieTheaterId: id },
      });
      movieTheater['photos'] = movieTheaterPhotos;
    }

    return movieTheaterDeleted;
  }
}
