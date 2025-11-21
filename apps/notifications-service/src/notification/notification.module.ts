import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GATEWAY_SERVICE } from './gateway.constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Notification]),
    ClientsModule.registerAsync([
      {
        name: GATEWAY_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://user:password@localhost:5672',
            ],
            queue: 'gateway_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [TypeOrmModule, NotificationModule],
})
export class NotificationModule {}
