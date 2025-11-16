import { Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE } from './auth.constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  async onModuleInit() {
    await this.authClient.connect();
  }

  async find() {
    return this.authClient.send({ cmd: 'find_user' }, {});
  }
}
