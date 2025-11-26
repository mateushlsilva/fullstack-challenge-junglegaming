import { z } from "zod";
import { PriorityEnum, StatusEnum } from '../../enums';

export const createTaskSchema = z.object({
  taskTitle: z.string().min(3).max(100),
  taskDescription: z.string().min(5).max(500),
  taskDueDate: z.date(),
  taskPriority: z.enum(PriorityEnum),
  taskStatus: z.enum(StatusEnum),
  assigned_user_ids: z.array(z.number()).nonempty(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
