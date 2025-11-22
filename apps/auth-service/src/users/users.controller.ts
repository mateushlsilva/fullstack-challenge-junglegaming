import {
  Controller,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @MessagePattern({ cmd: 'page_users' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async findAll(
    @Payload('page', ParseIntPipe) page: number = 1,
    @Payload('size', ParseIntPipe) size: number = 10,
  ) {
    return await this.userService.findQuery(page, size);
  }
}
