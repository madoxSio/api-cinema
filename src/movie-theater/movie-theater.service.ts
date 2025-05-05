import { Injectable, Logger } from '@nestjs/common';
import { CreateMovieTheaterDto as CreateMovieTheaterDto } from './dto/create-movie-theater.dto';
import { UpdateMovieTheaterDto as UpdateMovieTheaterDto } from './dto/update-movie-theater.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MovieTheaterService {
  private readonly logger = new Logger(MovieTheaterService.name);

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
    }

    return newMovieTheater;
  }

  async findAll() {
    this.logger.log('Fetching all movie theater halls');

    return await this.prisma.movieTheater.findMany({
      include: {
        photos: true,
      },
    });
  }

  async findOne(id: number) {
    this.logger.log(`Fetching movie theater hall with ID: ${id}`);

    return await this.prisma.movieTheater.findUnique({
      where: { id },
      include: {
        photos: true,
      },
    });
  }

  async update(id: number, updateMovieTheaterDto: UpdateMovieTheaterDto) {
    this.logger.log( `This action updates a #${id} movie theater`);

    const updtMovieThearter = await this.prisma.movieTheater.update({
      where :{
        id : id
      },
      data: {
        ...updateMovieTheaterDto,
        photos: updateMovieTheaterDto.photos
          ? {
              deleteMany: {},
              create: updateMovieTheaterDto.photos.map((url) => ({ url })),
            }
          : undefined,
      }
      
    });

    return updateMovieTheaterDto;
  }

  async remove(id: number) {
    this.logger.log( `This action removes a #${id} movie theater`);

    const movieTheater = await this.prisma.movieTheater.delete({
      where : {
        id : id
      }
    });
  }
}
