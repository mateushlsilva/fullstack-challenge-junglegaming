import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDTO, refreshTokenDto } from '@app/common';
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

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gerar um novo access token',
    description:
      'Recebe um refresh token válido e retorna um novo access token para o usuário continuar autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Novo access token gerado com sucesso.',
    schema: {
      example: {
        access_Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Refresh token inválido ou ausente.',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token expirado ou não autorizado.',
  })
  async refresh(@Body() data: refreshTokenDto) {
    return await this.authService.refresh(data);
  }
}
