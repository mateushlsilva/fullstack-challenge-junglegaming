import { Server, Socket } from 'socket.io';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PinoLogger } from 'nestjs-pino';
import { NotificationService } from './notification.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketNotification
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly logger: PinoLogger,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {
    this.logger.setContext(WebSocket.name);
  }

  handleConnection(client: Socket) {
    // Extrai o header. O tipo é: string | string[] | undefined
    const rawUserId = client.handshake.headers['x-user-id'];

    let userId: string | undefined;

    // Normaliza o valor: se for array, pega o primeiro; se for string, mantém; se for undefined, mantém.
    if (Array.isArray(rawUserId)) {
      userId = rawUserId[0];
    } else {
      userId = rawUserId;
    }

    if (userId) {
      client.join(userId);
      this.logger.info(
        `Usuário ${userId} conectado (Socket ID: ${client.id}).`,
      );
      this.notificationService.findStatusUnread(userId);
    } else {
      this.logger.warn(
        `Client sem 'x-user-id' header. Conexão limitada: ${client.id}.`,
      );
    }
  }
  handleDisconnect(client: Socket) {
    this.logger.info(`Client desconectado: ${client.id}`);
  }

  @SubscribeMessage('notification:received')
  handleAck(@MessageBody() id: string) {
    this.notificationService.patchStatus(id);
  }
}
