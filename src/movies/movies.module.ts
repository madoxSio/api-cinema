import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService,PrismaService],
})
export class MoviesModule {}
