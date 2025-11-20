import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [WebsocketController],
  providers: [WebsocketService],
  exports: [TypeOrmModule, WebsocketModule],
})
export class WebsocketModule {}
