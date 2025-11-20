import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard, CreateCommentDto } from '@app/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '@app/common';

@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Registrar um novo comentário' })
  @ApiResponse({
    status: 201,
    description: 'Cometário registrada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos (validação DTO).',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async post(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() data: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    data.user_id = Number(userId);
    return await this.commentsService.post(taskId, data);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'Buscar comentários por paginação' })
  @ApiResponse({
    status: 200,
    description: 'Comentários encontrada com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findQuery(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('size', ParseIntPipe) size: number = 10,
  ) {
    return await this.commentsService.query(taskId, page, size);
  }
}
