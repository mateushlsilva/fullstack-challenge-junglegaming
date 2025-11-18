import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDTO } from '@app/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({ status: 200, description: 'usuário logado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos (validação DTO).',
  })
  async login(@Body() data: LoginUserDTO) {
    return await this.authService.login(data);
  }
}
