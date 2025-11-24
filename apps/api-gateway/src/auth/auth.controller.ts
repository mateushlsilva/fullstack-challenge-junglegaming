import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDTO, refreshTokenDto } from '@app/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

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
  async register(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(data);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { ...result };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({ status: 200, description: 'usuário logado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos (validação DTO).',
  })
  async login(
    @Body() data: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(data);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    });

    return { access_token: result.access_token };
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
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'] as string;

    return this.authService.refresh({ refresh_token: refreshToken });
  }
}
