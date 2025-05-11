import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Histogram } from 'prom-client';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PROM_METRIC_HTTP_REQUEST_DURATION_SECONDS } from './metrics.constants';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @Inject(PROM_METRIC_HTTP_REQUEST_DURATION_SECONDS)
    private readonly histogram: Histogram,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context
      .switchToHttp()
      .getRequest<{ method: string; route: { path: string }; url: string }>();
    const method: string = req.method;
    const route: string = req.route?.path || req.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = (Date.now() - now) / 1000;
        this.histogram.labels(method, route).observe(duration);
      }),
    );
  }
}
