import { CreateUserDto, LoginUserDTO, refreshTokenDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private JWT_ACCESS_SECRET: string;
  private JWT_REFRESH_SECRET: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthService.name);
    this.JWT_ACCESS_SECRET = this.configService.get<string>(
      'JWT_ACCESS_SECRET',
    ) as string;
    this.JWT_REFRESH_SECRET = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
    ) as string;
  }

  async signIn(
    loginDto: LoginUserDTO,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.login(loginDto);

    const payload = { sub: user.id, userEmail: user.userEmail };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(dataDTO: refreshTokenDto): Promise<{ access_token: string }> {
    if (!dataDTO.refresh_token) {
      throw new RpcException({
        code: 401,
        message: 'Refresh token não informado',
      });
    }
    const data = await this.jwtService
      .verifyAsync<{
        sub: string;
        userEmail: string;
        iat?: number;
        exp?: number;
      }>(dataDTO.refresh_token, {
        secret: this.JWT_REFRESH_SECRET,
      })
      .catch(() => {
        throw new RpcException({
          code: 401,
          message: 'Refresh token inválido ou expirado',
        });
      });

    const user = await this.usersService.verifyUserExists(Number(data.sub));
    if (!user) {
      throw new RpcException({
        code: 404,
        message: 'Usuário não encontrado',
      });
    }

    const payload = { sub: data.sub, userEmail: data.userEmail };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      secret: this.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    return { access_token: newAccessToken };
  }

  async createUser(data: CreateUserDto): Promise<{
    access_token: string;
    refresh_Token: string;
    user: { id: number; userEmail: string; userName: string };
  }> {
    const user = await this.usersService.create(data);

    const payload = { sub: user.id, userEmail: user.userEmail };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refresh_Token = await this.jwtService.signAsync(payload, {
      secret: this.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      user,
      access_token,
      refresh_Token,
    };
  }
}
