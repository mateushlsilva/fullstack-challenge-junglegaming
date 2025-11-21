import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PinoLogger } from 'nestjs-pino';

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
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(WebSocket.name);
  }

  handleConnection(client: Socket) {
    // 1. Extrai o header. O tipo é: string | string[] | undefined
    const rawUserId = client.handshake.headers['x-user-id'];

    let userId: string | undefined;

    // 2. Normaliza o valor: se for array, pega o primeiro; se for string, mantém; se for undefined, mantém.
    if (Array.isArray(rawUserId)) {
      userId = rawUserId[0];
    } else {
      userId = rawUserId;
    }

    // 3. Type Guard: Garante que userId existe antes de tentar fazer o join.
    if (userId) {
      // client.join(userId) agora é seguro, pois userId é definitivamente uma string.
      client.join(userId);
      this.logger.info(
        `Usuário ${userId} conectado (Socket ID: ${client.id}).`,
      );
    } else {
      // Se não houver ID de usuário, loga um aviso e não tenta o join,
      // prevenindo o erro de compilação do TypeScript.
      this.logger.warn(
        `Client sem 'x-user-id' header. Conexão limitada: ${client.id}.`,
      );
    }
  }
  handleDisconnect(client: Socket) {
    this.logger.info(`Client desconectado: ${client.id}`);
  }
}
