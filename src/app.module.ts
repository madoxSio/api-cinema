import { Module } from '@nestjs/common';
import { HelloModule } from './hello-test/hello.module';
import { CinemaModule } from './cinema/cinema.module';

@Module({
  imports: [HelloModule, CinemaModule],
})
export class AppModule {}
