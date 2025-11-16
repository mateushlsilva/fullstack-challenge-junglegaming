import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  private RABBITMQ_URL: string;

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private memory: MemoryHealthIndicator,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(HealthController.name);

    this.RABBITMQ_URL = this.configService.get<string>(
      'RABBITMQ_URL',
      'amqp://user:password@rabbitmq:5672',
    );
  }

  @Get()
  @HealthCheck()
  @ApiExcludeEndpoint()
  check() {
    return this.health.check([
      () => this.http.pingCheck('google', 'https://google.com'),
      () =>
        this.microservice
          .pingCheck('rabbitmq', {
            transport: Transport.RMQ,
            options: {
              urls: [this.RABBITMQ_URL],
              queue: 'auth_queue',
              timeout: 1000,
            },
          })
          .catch((err) => {
            this.logger.error(
              { url: this.RABBITMQ_URL },
              'Falha no Health Check do Auth Service em RabbitMQ.',
            );
            throw err;
          }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150 MB
      () => this.memory.checkRSS('memory_rss', 200 * 1024 * 1024), // 200 MB
    ]);
  }
}
