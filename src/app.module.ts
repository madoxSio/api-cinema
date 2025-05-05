import { Module } from '@nestjs/common';
import { HelloModule } from './hello-test/hello.module';
import { MovieTheaterModule } from './movie-theater/movie-theater.module';
import { MoviesModule } from './movies/movies.module';
import { ScreeningModule } from './screening/screening.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [HelloModule,PrismaModule, MovieTheaterModule, MoviesModule, ScreeningModule],
})
export class AppModule {}
