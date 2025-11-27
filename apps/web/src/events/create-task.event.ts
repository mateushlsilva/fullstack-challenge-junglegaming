import type { CreateTaskDto } from "@/schemas";

export type CreateTaskEvent = CreateTaskDto & {
    id: number;
    creatorId: number;
}