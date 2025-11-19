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
import { TasksService } from './tasks.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard, CreateTaskDto } from '@app/common';
import type { AuthenticatedRequest } from '@app/common';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Registrar uma nova Task' })
  @ApiResponse({ status: 201, description: 'Task registrada com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos (validação DTO).',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async post(@Body() data: CreateTaskDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return await this.taskService.post(data, Number(userId));
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/:id')
  @ApiOperation({ summary: 'Buscar uma Task pelo ID' })
  @ApiResponse({ status: 200, description: 'Task encontrada com sucesso.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Task não encontrada.',
  })
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.taskService.getById(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'Buscar uma Tasks por paginação' })
  @ApiResponse({ status: 200, description: 'Tasks encontrada com sucesso.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findQuery(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('size', ParseIntPipe) size: number = 10,
  ) {
    return await this.taskService.query(page, size);
  }
}
