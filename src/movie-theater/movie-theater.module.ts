import { Module } from '@nestjs/common';
import { MovieTheaterService } from './movie-theater.service';
import { MovieTheaterController } from './movie-theater.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MovieTheaterController],
  providers: [MovieTheaterService, PrismaService],
})
export class MovieTheaterModule {}
