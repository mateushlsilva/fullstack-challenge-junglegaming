import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_SERVICE } from './auth.constants';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, LoginUserDTO, refreshTokenDto } from '@app/common';
import { lastValueFrom } from 'rxjs';

interface Error {
  code: number;
  message: string;
}

interface Login extends LoginUserDTO {
  refresh_token: string;
  access_token: string;
}

interface Register extends CreateUserDto {
  refresh_token: string;
  access_token: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  async onModuleInit() {
    await this.authClient.connect();
  }

  async register(data: CreateUserDto) {
    try {
      const res = await lastValueFrom(
        this.authClient.send<CreateUserDto>({ cmd: 'create_user' }, data),
      );

      return res as Register;
    } catch (error: unknown) {
      const err: Error = error as Error;
      console.error(err);
      if (err.code === 409) {
        throw new ConflictException(err.message);
      }

      throw new InternalServerErrorException(
        err?.message || 'Erro inesperado no gateway',
      );
    }
  }

  async login(data: LoginUserDTO) {
    try {
      const res = await lastValueFrom(
        this.authClient.send<LoginUserDTO>({ cmd: 'login_user' }, data),
      );

      return res as Login;
    } catch (error: unknown) {
      const err: Error = error as Error;
      console.error(err);
      if (err.code === 400) {
        throw new BadRequestException('Dados de login não conferem');
      }

      throw new InternalServerErrorException(
        err?.message || 'Erro inesperado no gateway',
      );
    }
  }

  async refresh(data: refreshTokenDto) {
    try {
      const res = await lastValueFrom(
        this.authClient.send<string>({ cmd: 'refresh_token' }, data),
      );

      return res;
    } catch (error: unknown) {
      const err: Error = error as Error;
      console.error(err);
      if (err.code === 400) {
        throw new BadRequestException('Refresh token inválido ou ausente.');
      }

      if (err.code === 401) {
        throw new UnauthorizedException(
          'Refresh token expirado ou não autorizado.',
        );
      }

      throw new InternalServerErrorException(
        err?.message || 'Erro inesperado no gateway',
      );
    }
  }
}
