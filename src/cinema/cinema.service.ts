import { Injectable, Logger } from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CinemaService {
  private readonly logger = new Logger(CinemaService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCinemaDto: CreateCinemaDto) {
    this.logger.log('Creating a new cinema hall');
    this.logger.debug(`Received data: ${JSON.stringify(createCinemaDto)}`);

    const { photos, ...cinemaData } = createCinemaDto;

    const cinema = await this.prisma.cinemaHall.create({
      data: cinemaData,
    });

    if (photos) {
      await this.prisma.cinemaHallPhoto.createMany({
        data: photos.map((photo) => ({
          cinemaHallId: cinema.id,
          url: photo,
        })),
      });
    }

    return cinema;
  }

  async findAll() {
    this.logger.log('Fetching all cinema halls');

    return await this.prisma.cinemaHall.findMany({
      include: {
        photos: true,
      },
    });
  }

  async findOne(id: number) {
    this.logger.log(`Fetching cinema hall with ID: ${id}`);

    return await this.prisma.cinemaHall.findUnique({
      where: { id },
      include: {
        photos: true,
      },
    });
  }

  update(id: number, updateCinemaDto: UpdateCinemaDto) {
    return `This action updates a #${id} cinema`;
  }

  remove(id: number) {
    return `This action removes a #${id} cinema`;
  }
}
