import type { CreateTaskDto } from './tasks/create-task.schema';
import { createTaskSchema } from './tasks/create-task.schema';
import type { CreateCommentDto } from './comments/create-comments.schema';
import { createCommentSchemas } from './comments/create-comments.schema';
import type { LoginDto } from './auth/login.schema';
import { loginSchemas } from './auth/login.schema';
import type { RegisterDto } from './auth/register.schema';
import { registerSchemas } from './auth/register.schema';
import type { RefreshDto } from './auth/refresh.schema';
import { refreshSchemas } from './auth/refresh.schema';

export {
    createTaskSchema,
    createCommentSchemas,
    loginSchemas,
    registerSchemas,
    refreshSchemas,
}

export type {
    CreateTaskDto,
    CreateCommentDto,
    LoginDto,
    RegisterDto,
    RefreshDto,
}