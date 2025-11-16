import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  private AUTH_URL_HEALTH: string;
  private TASKS_URL_HEALTH: string;
  private NOTIFICATIONS_URL_HEALTH: string;

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(HealthController.name);

    this.AUTH_URL_HEALTH = this.configService.get<string>(
      'AUTH_URL_HEALTH',
      'http://auth-service:3002/health',
    );
    this.TASKS_URL_HEALTH = this.configService.get<string>(
      'TASKS_URL_HEALTH',
      'http://tasks-service:3003/health',
    );

    this.NOTIFICATIONS_URL_HEALTH = this.configService.get<string>(
      'NOTIFICATIONS_URL_HEALTH',
      'http://notifications-service:3004/health',
    );

    this.logger.debug(
      `Health check URLs definidas: Auth=${this.AUTH_URL_HEALTH}, Tasks=${this.TASKS_URL_HEALTH}, Notifications=${this.NOTIFICATIONS_URL_HEALTH}`,
    );
  }

  @Get()
  @HealthCheck()
  @ApiExcludeEndpoint()
  async check(): Promise<HealthCheckResult> {
    this.logger.info(
      'Executando Health Check do Gateway. Pingando serviços downstream...',
    );
    return this.health.check([
      () => this.http.pingCheck('google', 'https://google.com'),
      // Health check para o Auth Service
      () =>
        this.http
          .pingCheck('Auth Service', this.AUTH_URL_HEALTH)
          .catch((err) => {
            this.logger.error(
              { url: this.AUTH_URL_HEALTH },
              'Falha no Health Check do Auth Service.',
            );
            throw err;
          }),

      // Health check para o Tasks Service
      () =>
        this.http
          .pingCheck('Tasks Service', this.TASKS_URL_HEALTH)
          .catch((err) => {
            this.logger.error(
              { url: this.TASKS_URL_HEALTH },
              'Falha no Health Check do Tasks Service.',
            );
            throw err;
          }),
      // Health check para o Notifications Service
      () =>
        this.http
          .pingCheck('Notifications Service', this.NOTIFICATIONS_URL_HEALTH)
          .catch((err) => {
            this.logger.error(
              { url: this.NOTIFICATIONS_URL_HEALTH },
              'Falha no Health Check do Notifications Service.',
            );
            throw err;
          }),
    ]);
  }
}
