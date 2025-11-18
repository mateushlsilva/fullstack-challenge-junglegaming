import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskAssigneeDto {
  @ApiProperty({
    description: 'ID da tarefa à qual o usuário será atribuído',
    example: 1,
  })
  @IsNumber()
  task_id: number;

  @ApiProperty({
    description: 'ID do usuário atribuído à tarefa (vindo do auth-service)',
    example: 123,
  })
  @IsNumber()
  user_id: number;
}