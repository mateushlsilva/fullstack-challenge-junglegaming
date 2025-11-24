import { z } from 'zod';

export const registerSchemas = z.object({
    userEmail: z.email("Email inválido").min(5, { error: "O email é obrigatório" }),
    userName: z.string().min(8, { error:  "O nome deve ter no mínimo 8 caracteres" }).max(80, { error: "O nome deve ter no máximo 64 caracteres" }),
    userPassword: z.string().min(8, { error:  "A senha deve ter no mínimo 8 caracteres" }).max(64, { error: "A senha deve ter no máximo 64 caracteres" }),
})

export type RegisterDto = z.infer<typeof registerSchemas>;