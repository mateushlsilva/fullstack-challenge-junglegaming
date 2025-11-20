import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { Socket, io } from 'socket.io-client';

@Injectable()
export class WebsocketService implements OnModuleInit, OnModuleDestroy {
  private socket: Socket;
  private readonly GATEWAY_WS_URL: string;
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
  ) {
    this.logger.setContext(WebsocketService.name);
    this.GATEWAY_WS_URL =
      this.configService.get<string>('GATEWAY_WS_URL') || 'ws://localhost:3001';
  }

  onModuleInit() {
    this.logger.info(
      `Tentando conectar ao API Gateway em: ${this.GATEWAY_WS_URL}`,
    );

    // Conecta ao servidor WebSocket (API Gateway)
    this.socket = io(this.GATEWAY_WS_URL, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.logger.info('✅ Conectado ao API Gateway via WebSocket.');
    });

    this.socket.on('disconnect', () => {
      this.logger.info('❌ Desconectado do API Gateway.');
    });

    this.socket.on('connect_error', (err) => {
      this.logger.error('Erro de conexão com o Gateway:', err.message);
    });
  }

  onModuleDestroy() {
    this.socket.close();
  }

  emitNotication(userId: string, event: string, payload: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('internal:notify', { userId, event, payload });
    } else {
      this.logger.warn(
        'Cliente WebSocket não conectado. Notificação perdida:',
        event,
      );
    }
  }
}
