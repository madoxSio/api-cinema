import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';
import { PROM_METRIC_HTTP_REQUEST_DURATION_SECONDS } from './metrics.constants';

@Module({
  imports: [PrometheusModule.register()],
  providers: [
    {
      provide: PROM_METRIC_HTTP_REQUEST_DURATION_SECONDS,
      useFactory: (): Histogram => {
        return new Histogram({
          name: 'http_request_duration_seconds',
          help: 'Duration of HTTP requests in seconds',
          labelNames: ['method', 'route'],
        });
      },
    },
  ],
  exports: [PROM_METRIC_HTTP_REQUEST_DURATION_SECONDS],
})
export class MetricsModule {}
