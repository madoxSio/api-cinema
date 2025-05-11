import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { ScreeningModule } from './screening/screening.module';
import { PrismaModule } from './prisma.module';
import { MovieTheatersModule } from './movie-theaters/movie-theaters.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TicketModule } from './ticket/ticket.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    PrismaModule,
    MovieTheatersModule,
    MoviesModule,
    ScreeningModule,
    AuthModule,
    UsersModule,
    TicketModule,
    MetricsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule {}
