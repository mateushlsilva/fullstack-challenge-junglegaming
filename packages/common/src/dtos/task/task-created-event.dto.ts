import { CreateTaskDto } from './create-task.dto';

export class TaskCreatedEventDto extends CreateTaskDto {
  id: number;
  creatorId: number;
}
