import { z } from 'zod';

export const loginSchemas = z.object({
    userEmail: z.email("Email inválido").min(5, { error: "O email é obrigatório" }),
    userPassword: z.string().min(8, { error:  "A senha deve ter no mínimo 8 caracteres" }).max(64, { error: "A senha deve ter no máximo 64 caracteres" }),
})

export type LoginDto = z.infer<typeof loginSchemas>;