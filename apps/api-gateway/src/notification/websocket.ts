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
import { WsAuthService } from '@app/common';

//@UseGuards(WsAuthGuard)
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
    private readonly wsAuthService: WsAuthService,
  ) {
    this.logger.setContext(WebSocket.name);
  }

  async handleConnection(client: Socket) {
    const userId = await this.wsAuthService.authenticateClient(client);

    if (!userId) {
      this.logger.warn(`Cliente sem token. Desconectando: ${client.id}`);
      client.disconnect(true);
      return;
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
      client.disconnect(true);
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
