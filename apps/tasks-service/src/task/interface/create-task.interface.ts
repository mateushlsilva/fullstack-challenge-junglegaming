import { CreateTaskDto } from '@app/common';

export interface CreateTaskInterface {
  data: CreateTaskDto;
  userId: number;
}
