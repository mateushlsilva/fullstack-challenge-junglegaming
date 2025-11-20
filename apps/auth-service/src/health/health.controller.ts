import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

@Controller('health')
export class HealthController {
  private RABBITMQ_URL: string;
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
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

  //@UseGuards(AuthGuard)
  @Get()
  @HealthCheck()
  @ApiExcludeEndpoint()
  check(): Promise<HealthCheckResult> {
    this.logger.info('Executando Health Check do Auth.');
    return this.health.check([
      () => this.http.pingCheck('google', 'https://google.com'),
      () =>
        this.db.pingCheck('database', { timeout: 1500 }).catch((err) => {
          this.logger.error(
            { url: 'database' },
            'Falha no Health Check do Auth Service em database.',
          );
          throw err;
        }),
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
