import { IsNumber, IsString, MaxLength, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  task_id?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @ApiProperty({
    description: 'Conteúdo do comentário',
    example: 'Essa tarefa precisa ser revisada até amanhã.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}