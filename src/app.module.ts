import { Module } from '@nestjs/common';
import { HelloModule } from './hello-test/hello.module';
import { MovieTheaterModule } from './movie-theater/movie-theater.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HelloModule, MovieTheaterModule, AuthModule, UsersModule],
})
export class AppModule {}
