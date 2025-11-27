import type { CreateTaskDto } from "@/schemas";

export type  UpdateTaskEvent = CreateTaskDto & {
    id: number;
    creatorId: number;
}