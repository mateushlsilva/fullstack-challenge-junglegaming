import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { PinoLogger } from 'nestjs-pino';
import { CreateTaskDto } from '@app/common';

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
    return await this.taskService.createTask(data, 1);
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
}
