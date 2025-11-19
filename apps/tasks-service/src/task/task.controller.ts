import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { PinoLogger } from 'nestjs-pino';
import { UpdateTaskDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { CreateTaskInterface } from './interface/create-task.interface';

@Controller('tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TaskController.name);
  }

  @MessagePattern({ cmd: 'create_task' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async post(@Payload() menssageData: CreateTaskInterface) {
    const { data, userId } = menssageData;
    this.logger.info(
      `Task Service: Comando 'create_task' recebido para: ${data.taskTitle}`,
    );
    return await this.taskService.createTask(data, userId);
  }

  @MessagePattern({ cmd: 'getid_task' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async get(@Payload('id', ParseIntPipe) id: number) {
    return await this.taskService.findById(id);
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('size', ParseIntPipe) size: number = 10,
  ) {
    return await this.taskService.findAll(page, size);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.taskService.delete(id);
  }

  @Put('/:id')
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(id, data, 1);
  }
}
