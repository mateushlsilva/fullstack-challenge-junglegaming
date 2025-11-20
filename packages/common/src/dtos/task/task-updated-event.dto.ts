import { UpdateTaskDto } from "./update-task.dto";


export class TaskUpdatedEventDto extends UpdateTaskDto {
  id: number;
  creatorId: number;
}
