import { Injectable } from '@nestjs/common';
import { WebSocketNotification } from './websocket';
import { PinoLogger } from 'nestjs-pino';
import {
  CommentCreatedEventDto,
  TaskCreatedEventDto,
  TaskUpdatedEventDto,
} from '@app/common';

@Injectable()
export class NotificationService {
  constructor(
    private readonly gateway: WebSocketNotification,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(WebSocket.name);
  }

  async sendToUser(data: {
    userId: string;
    event: string;
    payload: {
      message: string;
      data: TaskCreatedEventDto | TaskUpdatedEventDto | CommentCreatedEventDto;
    };
  }) {
    this.logger.info(`Enviando WS para user ${data.userId}`);

    this.gateway.server.to(data.userId).emit(data.event, data.payload);
  }

  async find() {}
}
