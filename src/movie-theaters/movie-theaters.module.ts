import { Module } from '@nestjs/common';
import { MovieTheatersService } from './movie-theaters.service';
import { MovieTheatersController } from './movie-theaters.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MovieTheatersController],
  providers: [MovieTheatersService, PrismaService],
})
export class MovieTheatersModule {}
