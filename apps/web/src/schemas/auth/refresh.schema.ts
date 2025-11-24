import { z } from 'zod';

export const refreshSchemas = z.object({
    refresh_token: z.string().min(10),
})

export type RefreshDto = z.infer<typeof refreshSchemas>;