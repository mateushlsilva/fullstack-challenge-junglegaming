import { Body, Controller, Post } from '@nestjs/common';
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
}
