import { Module } from '@nestjs/common';
import { HelloModule } from './hello-test/hello.module';
import { MoviesModule } from './movies/movies.module';
import { ScreeningModule } from './screening/screening.module';
import { PrismaModule } from './prisma.module';
import { MovieTheatersModule } from './movie-theaters/movie-theaters.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HelloModule, PrismaModule, MovieTheatersModule, MoviesModule, ScreeningModule, AuthModule, UsersModule],
})
export class AppModule {}
