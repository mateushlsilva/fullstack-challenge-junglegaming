import { useLogin } from "./mutations/login.hooks";
import { useRegister } from "./mutations/register.hooks";
import { useTaskQuery } from "./queries/tasks-getquery.hook";
import { useUserQuery } from "./queries/users-getquery.hook";
import { useTaskCreate } from "./mutations/task-create.hooks";
import { useAuthWebSocket } from "./websocket/web-socket.hook";
import { useCommentCreate } from "./mutations/commests-create.hook";
import { useTaskUpdate } from "./mutations/task-update.hooks";
import { useKanbanStatus } from "./mutations/kanban-status.hooks";

export {
    useLogin,
    useRegister,
    useTaskQuery,
    useUserQuery,
    useTaskCreate,
    useAuthWebSocket,
    useCommentCreate,
    useTaskUpdate,
    useKanbanStatus,
}