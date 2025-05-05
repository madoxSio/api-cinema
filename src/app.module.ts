import { Module } from '@nestjs/common';
import { HelloModule } from './hello-test/hello.module';
import { MovieTheaterModule } from './movie-theater/movie-theater.module';

@Module({
  imports: [HelloModule, MovieTheaterModule],
})
export class AppModule {}
