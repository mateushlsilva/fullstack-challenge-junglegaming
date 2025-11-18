import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID da tarefa à qual o comentário pertence',
    example: 1,
  })
  @IsNumber()
  task_id: number;

  @ApiProperty({
    description: 'ID do usuário que criou o comentário (vindo do auth-service)',
    example: 123,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'Conteúdo do comentário',
    example: 'Essa tarefa precisa ser revisada até amanhã.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}