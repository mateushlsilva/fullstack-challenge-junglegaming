import { z } from "zod";
import { PriorityEnum, StatusEnum } from '@app/common';

export const createTaskSchema = z.object({
  taskTitle: z.string().min(3).max(100),
  taskDescription: z.string().min(5).max(500),
  taskDueDate: z.coerce.date(),
  taskPriority: z.enum(PriorityEnum),
  taskStatus: z.enum(StatusEnum),
  assigned_user_ids: z.array(z.number()).nonempty(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
