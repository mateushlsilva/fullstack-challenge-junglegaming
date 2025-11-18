import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, LoginUserDTO, refreshTokenDto } from '@app/common';
import { PinoLogger } from 'nestjs-pino';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @MessagePattern({ cmd: 'create_user' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async handleCreateUser(@Payload() data: CreateUserDto) {
    this.logger.info(
      `Auth Service: Comando 'create_user' recebido para: ${data.userEmail}`,
    );

    const newUser = await this.authService.createUser(data);

    return {
      message: 'Usuário criado com sucesso',
      user: newUser.user,
      access_token: newUser.access_token,
      refresh_Token: newUser.refresh_Token,
    };
  }

  @MessagePattern({ cmd: 'login_user' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async handleLoginUser(@Payload() data: LoginUserDTO) {
    this.logger.info(
      `Auth Service: Comando 'login_user' recebido para: ${data.userEmail}`,
    );

    const login = await this.authService.signIn(data);

    return {
      access_token: login.access_token,
      refresh_token: login.refresh_token,
    };
  }

  @MessagePattern({ cmd: 'refresh_token' })
  async handleRefreshToken(@Payload() data: refreshTokenDto) {
    this.logger.info(`Auth Service: Comando 'refresh_token'`);

    const refresh = await this.authService.refresh(data);

    return { refresh };
  }
}
