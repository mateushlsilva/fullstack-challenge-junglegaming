import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { AUTH_SERVICE } from './auth.constants';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common';
import { lastValueFrom } from 'rxjs';

interface Error {
  code: number;
  message: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  async onModuleInit() {
    await this.authClient.connect();
  }

  async find() {
    return this.authClient.send({ cmd: 'find_user' }, {});
  }

  async register(data: CreateUserDto) {
    try {
      const res = await lastValueFrom(
        this.authClient.send<CreateUserDto>({ cmd: 'create_user' }, data),
      );

      return res;
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
}
