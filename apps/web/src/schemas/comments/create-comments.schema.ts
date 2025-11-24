import { z } from 'zod';

export const createCommentSchemas = z.object({
    content: z.string().min(1).max(500),
})

export type CreateCommentDto = z.infer<typeof createCommentSchemas>;