import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
import { WsAuthService } from './ws-auth.service';
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
  ],
  providers: [AuthGuard, WsAuthService],
  exports: [AuthGuard, JwtModule, WsAuthService ],
})
export class AuthCommonModule {}
