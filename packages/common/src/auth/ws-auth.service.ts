import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class WsAuthService {
  private readonly logger = new Logger(WsAuthService.name);
  private readonly JWT_ACCESS_SECRET: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_ACCESS_SECRET = this.configService.get<string>('JWT_ACCESS_SECRET') || 'sua_secret';
  }


  async extractToken(client: Socket): Promise<string | null>{
    const authHeader = client.handshake.headers['authorization'];
    let token: string | undefined;

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (client.handshake.query.token) {
      const raw = client.handshake.query.token;
      token = Array.isArray(raw) ? raw[0] : raw;
      token = token?.replace('Bearer ', '');
    }

    if (!token) {
      this.logger.warn(`Tentativa de conexão WS sem token.`);
      return null;
    }

    return token;
  }


  async validateToken(token: string): Promise<string | null> {
    try {
      const payload: JwtPayload = await this.jwtService.verify(token, {
        secret: this.JWT_ACCESS_SECRET,
      });

      if (!payload.sub) {
        return null
      }

      return payload.sub.toString();
    } catch (err) {
      this.logger.error(`Erro ao validar token WS: ${err.message}`);
      return null
    }
  }

  async authenticateClient(client: Socket): Promise<string | null> {
    try{
        const token = await this.extractToken(client);
        if (token === null) return null
        const rawUserId = await this.validateToken(token);
        if (rawUserId === null) return null
        
        client.handshake.headers['x-user-id'] = rawUserId;

        let userId: string | null;

        // Normaliza o valor: se for array, pega o primeiro; se for string, mantém; se for undefined, mantém.
        if (Array.isArray(rawUserId)) {
        userId = rawUserId[0];
        } else {
        userId = rawUserId;
        }
        this.logger.log(`WS autenticado → userId: ${userId}`);

        return userId;
    }catch (err) {
      this.logger.error(`Erro ao validar token WS: ${err.message}`);
      return null
    }
    
  }
}
