import { IsString, MaxLength, MinLength, IsEnum, IsDateString, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PriorityEnum } from '../../enums/priority.enum';
import { StatusEnum } from '../../enums/status.enum';

export class UpdateTaskDto {
    @ApiProperty({
    description: 'Título da tarefa',
    example: 'Finalizar relatório semanal',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  taskTitle: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example: 'Concluir o relatório semanal de atividades e enviar para o gerente.',
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  taskDescription: string;

  @ApiProperty({
    description: 'Data de vencimento da tarefa',
    example: '2025-12-01T18:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  taskDueDate: Date;

  @ApiProperty({
    description: 'Prioridade da tarefa',
    enum: PriorityEnum,
    example: PriorityEnum.HIGH,
  })
  @IsEnum(PriorityEnum)
  taskPriority: PriorityEnum;

  @ApiProperty({
    description: 'Status atual da tarefa',
    enum: StatusEnum,
    example: StatusEnum.TODO,
  })
  @IsEnum(StatusEnum)
  taskStatus: StatusEnum;


  @ApiProperty({
    description: 'IDs dos usuários atribuídos à tarefa',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  assigned_user_ids: number[];


}