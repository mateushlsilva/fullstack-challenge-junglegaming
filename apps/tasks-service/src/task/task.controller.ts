import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { PinoLogger } from 'nestjs-pino';
import { CreateTaskDto, UpdateTaskDto } from '@app/common';

@Controller('task')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TaskController.name);
  }

  @Post()
  async post(@Body() data: CreateTaskDto) {
    return await this.taskService.createTask(data, 1); //Trocar depois esse 1 pelo id vindo do RMQ
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
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
