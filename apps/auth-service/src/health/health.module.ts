import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthCommonModule } from '@app/common';

@Module({
  imports: [TerminusModule, HttpModule, ConfigModule, AuthCommonModule],
  controllers: [HealthController],
})
export class HealthModule {}
