import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findUsers() {
    // Chama o método find() no AuthService, que envia o comando { cmd: 'find_user' } para o RMQ.
    // O Gateway espera a resposta e a retorna como JSON HTTP.
    return this.authService.find();
  }
}
