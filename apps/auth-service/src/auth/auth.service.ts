import { LoginUserDTO } from '@app/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

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
  ): Promise<{ access_token: string; refresh_Token: string }> {
    const user = await this.usersService.login(loginDto);

    const payload = { sub: user.id, useremail: user.userEmail };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refresh_Token = await this.jwtService.signAsync(payload, {
      secret: this.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_Token,
    };
  }

  async refresh(refreshToken: string): Promise<{ access_Token: string }> {
    const data = await this.jwtService.verifyAsync<{
      sub: string;
      userEmail: string;
      iat?: number;
      exp?: number;
    }>(refreshToken, {
      secret: this.JWT_REFRESH_SECRET,
    });

    const payload = { sub: data.sub, userEmail: data.userEmail };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      secret: this.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    return { access_Token: newAccessToken };
  }
}
