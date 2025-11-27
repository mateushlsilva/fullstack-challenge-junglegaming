import {
  Controller,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { PinoLogger } from 'nestjs-pino';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { CreateTaskInterface } from './interface/create-task.interface';
import type { UpdateTaskInterface } from './interface/update-task.interface';

@Controller()
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
  async get(
    @Payload('id', ParseIntPipe) id: number,
    @Payload('userId', ParseIntPipe) userId: number,
  ) {
    return await this.taskService.findById(id, userId);
  }

  @MessagePattern({ cmd: 'page_task' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async findAll(
    @Payload('page', ParseIntPipe) page: number = 1,
    @Payload('size', ParseIntPipe) size: number = 10,
    @Payload('userId', ParseIntPipe) userId: number,
  ) {
    return await this.taskService.findAll(page, size, userId);
  }

  @MessagePattern({ cmd: 'delete_task' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async delete(
    @Payload('id', ParseIntPipe) id: number,
    @Payload('userId', ParseIntPipe) userId: number,
  ) {
    this.logger.info(`[TaskController] Tentativa de deletar Task ID: ${id}`);
    return await this.taskService.delete(id, userId);
  }

  @MessagePattern({ cmd: 'put_task' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async put(
    @Payload('id', ParseIntPipe) id: number,
    @Payload() messageData: UpdateTaskInterface,
  ) {
    const { data, userId } = messageData;
    return await this.taskService.updateTask(id, data, userId);
  }
}
