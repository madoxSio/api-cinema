import { Module } from '@nestjs/common';
import { HelloModule } from './hello-test/hello.module';
import { MovieTheatersModule } from './movie-theaters/movie-theaters.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HelloModule, MovieTheatersModule, AuthModule, UsersModule],
})
export class AppModule {}
