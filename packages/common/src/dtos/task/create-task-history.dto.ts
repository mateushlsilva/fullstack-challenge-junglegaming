import { IsEnum, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActionEnum } from '../../enums/action.enum';

export class CreateTaskHistoryDto {
  @ApiProperty({
    description: 'ID do usuário que realizou a ação',
    example: 123,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'Ação realizada na tarefa',
    enum: ActionEnum,
    example: ActionEnum.CREATED,
  })
  @IsEnum(ActionEnum)
  action: ActionEnum;

  @ApiPropertyOptional({
    description: 'Valores antigos antes da ação (opcional)',
    type: Object,
    example: { title: 'Tarefa antiga', status: 'TODO' },
  })
  @IsOptional()
  @IsObject()
  old_value?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Novos valores após a ação (opcional)',
    type: Object,
    example: { title: 'Tarefa atualizada', status: 'IN_PROGRESS' },
  })
  @IsOptional()
  @IsObject()
  new_value?: Record<string, any>;
}
