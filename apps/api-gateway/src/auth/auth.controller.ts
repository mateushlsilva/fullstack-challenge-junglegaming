import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@app/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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

  @Post('/register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos (validação DTO).',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está sendo usado.',
  })
  async register(@Body() data: CreateUserDto) {
    return await this.authService.register(data);
  }
}
