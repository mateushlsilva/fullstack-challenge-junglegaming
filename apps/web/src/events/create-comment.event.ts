import type { CreateCommentDto } from "@/schemas";

export type CreateCommentEvent = CreateCommentDto & {
    id: number;
    assigned_user_ids: number[];
    task_id: number;
    user_id: number;
}