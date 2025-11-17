import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common';
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
}
