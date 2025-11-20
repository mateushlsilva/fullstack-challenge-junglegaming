import { CreateCommentDto } from '@app/common';
import {
  Controller,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PinoLogger } from 'nestjs-pino';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CommentsController {
  constructor(
    private commentService: CommentsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CommentsController.name);
  }

  @MessagePattern({ cmd: 'page_comments' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async findAll(
    @Payload('taskId', ParseIntPipe) taskId: number,
    @Payload('page', ParseIntPipe) page: number = 1,
    @Payload('size', ParseIntPipe) size: number = 10,
  ) {
    return await this.commentService.getQuery(taskId, page, size);
  }

  @MessagePattern({ cmd: 'create_comments' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async post(
    @Payload('taskId', ParseIntPipe) taskId: number,
    @Payload() payload: any,
  ) {
    this.logger.debug(`Esse é o idTask: ${taskId}`);
    const data: CreateCommentDto = payload as CreateCommentDto;
    data.task_id = taskId;
    return await this.commentService.createComment(data);
  }
}
