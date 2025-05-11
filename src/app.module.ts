import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { ScreeningModule } from './screening/screening.module';
import { PrismaModule } from './prisma.module';
import { MovieTheatersModule } from './movie-theaters/movie-theaters.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TicketModule } from './ticket/ticket.module';
import { MoneyService } from './money/money.service';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    PrometheusModule.register(),
    PrismaModule,
    MovieTheatersModule,
    MoviesModule,
    ScreeningModule,
    AuthModule,
    UsersModule,
    TicketModule,
  ],
  providers: [
    MoneyService,
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Nombre total de requêtes HTTP',
      labelNames: ['method', 'path'],
    }),
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule {}
