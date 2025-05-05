import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateScreeningDTO } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { PrismaService } from '../prisma.service';
import { addMinutes } from 'date-fns';

@Injectable()
export class ScreeningService {
  private readonly logger = new Logger(ScreeningService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateScreeningDTO) {
    const { movieId, movieTheaterId, start } = createDto;

    try {
      const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
      if (!movie) throw new NotFoundException(`Movie with ID ${movieId} not found`);

      const theater = await this.prisma.movieTheater.findUnique({ where: { id: movieTheaterId } });
      if (!theater) throw new NotFoundException(`Theater with ID ${movieTheaterId} not found`);

      const startDate = new Date(start); // start est censé être un string ISO
      const endDate = addMinutes(startDate, movie.duration + 30); // durée + pub/nettoyage

      // Vérifie le chevauchement
      const conflict = await this.prisma.screening.findFirst({
        where: {
          movieTheaterId,
          OR: [
            {
              start: { lte: endDate.toISOString() },
              end: { gte: startDate.toISOString() },
            },
          ],
        },
      });

      if (conflict) {
        throw new ConflictException(`Créneau occupé chef.`);
      }

      const screening = await this.prisma.screening.create({
        data: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          date: startDate.toISOString(),
          movieId,
          movieTheaterId,
        },
      });

      return screening;
    } catch (error) {
      this.logger.error('Error creating screening', error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Could not create screening');
    }
  }

  async findAll() {
    return this.prisma.screening.findMany({
      include: {
        movie: true,
        movieTheater: true,
      },
    });
  }

  async findOne(id: number) {
    const screening = await this.prisma.screening.findUnique({
      where: { id },
      include: {
        movie: true,
        movieTheater: true,
      },
    });

    if (!screening) {
      throw new NotFoundException(`Screening with ID ${id} not found`);
    }

    return screening;
  }

  async update(id: number, updateDto: UpdateScreeningDto) {
    const existing = await this.prisma.screening.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Screening with ID ${id} not found`);
    }

    try {
      // Filtrage manuel des champs pour éviter les erreurs Prisma
      const { movieTheaterId, ...safeData } = updateDto;

      const updated = await this.prisma.screening.update({
        where: { id },
        data: safeData,
      });
      return updated;
    } catch (error) {
      this.logger.error(`Error updating screening #${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update screening');
    }
  }

  async remove(id: number) {
    const screening = await this.prisma.screening.findUnique({ where: { id } });

    if (!screening) {
      throw new NotFoundException(`Screening with ID ${id} not found`);
    }

    await this.prisma.screening.delete({ where: { id } });
    return { message: `Screening #${id} deleted successfully.` };
  }
}
