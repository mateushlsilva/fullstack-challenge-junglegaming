import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TASkS_SERVICE } from './task.constants';
import { AuthCommonModule } from '@app/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TASkS_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://user:password@localhost:5672',
            ],
            queue: 'tasks_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    AuthCommonModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
