import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { WebSocketNotification } from './websocket';
import { PinoLogger } from 'nestjs-pino';
import {
  CommentCreatedEventDto,
  CreateNotificationDto,
  TaskCreatedEventDto,
  TaskUpdatedEventDto,
} from '@app/common';
import { NOTIFICATION_GATEWAY_SERVICE } from './notification-gateway.constants';
import { ClientProxy } from '@nestjs/microservices';

interface Payload {
  message: string;
  data: TaskCreatedEventDto | TaskUpdatedEventDto | CommentCreatedEventDto;
}
@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => WebSocketNotification))
    private readonly gateway: WebSocketNotification,
    @Inject(NOTIFICATION_GATEWAY_SERVICE)
    private readonly notificationGatewayClient: ClientProxy,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(WebSocket.name);
  }

  sendToUser(data: {
    id: string;
    userId: string;
    event: string;
    payload: Payload;
  }) {
    this.logger.info(`Enviando WS para user ${data.userId}`);
    this.gateway.server
      .to(data.userId)
      .emit(data.event, { id: data.id, ...data.payload });
  }

  findStatusUnread(userId: string) {
    this.logger.debug(`Entrou aqui e recebeu o id desse usuario: ${userId}`);
    this.notificationGatewayClient
      .send<CreateNotificationDto[]>({ cmd: 'notify_find' }, userId)
      .subscribe((notifications) => {
        for (const notification of notifications) {
          if (!notification.id) {
            this.logger.warn('Notificação sem ID');
            continue;
          }
          this.sendToUser({
            id: notification.id,
            event: notification.type,
            userId,
            payload: notification.payload as Payload,
          });
        }
      });
    this.logger.debug(`Já pegou tudo do id desse usuario aqui: ${userId}`);
  }

  patchStatus(id: string) {
    this.notificationGatewayClient.emit('notify.status', id);
  }
}
