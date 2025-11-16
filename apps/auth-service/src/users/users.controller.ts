import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern({ cmd: 'find_user' })
  async getAll(): Promise<User[]> {
    console.log(`Auth Service: Comando 'find_user' recebido.`);
    return this.userService.findAll();
  }
}
