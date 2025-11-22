import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { USERS_SERVICE } from './users.constants';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common';
import { lastValueFrom } from 'rxjs';

interface Error {
  code: number;
  message: string;
}

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.usersClient.connect();
  }

  async query(page: number, size: number) {
    try {
      const res = await lastValueFrom(
        this.usersClient.send<CreateUserDto>(
          { cmd: 'page_users' },
          { page, size },
        ),
      );

      return res;
    } catch (error: unknown) {
      const err: Error = error as Error;
      console.error(error);
      if (err.code == 401) {
        throw new UnauthorizedException();
      }

      throw new InternalServerErrorException(
        err?.message || 'Erro inesperado no gateway',
      );
    }
  }
}
