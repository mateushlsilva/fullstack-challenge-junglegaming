import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { WebSocketNotification } from './websocket';
import { NotificationController } from './notification.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_GATEWAY_SERVICE } from './notification-gateway.constants';

@Module({
  imports: [
    forwardRef(() => NotificationModule),
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_GATEWAY_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://user:password@localhost:5672',
            ],
            queue: 'notifications_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [NotificationService, WebSocketNotification],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
