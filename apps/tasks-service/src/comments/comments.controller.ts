import { CreateCommentDto } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PinoLogger } from 'nestjs-pino';

@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(
    private commentService: CommentsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CommentsController.name);
  }

  @Get()
  async findAll(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('size', ParseIntPipe) size: number = 10,
  ) {
    return await this.commentService.getQuery(taskId, page, size);
  }

  @Post()
  async post(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() data: CreateCommentDto,
  ) {
    data.task_id = taskId;
    return await this.commentService.createComment(data);
  }
}
