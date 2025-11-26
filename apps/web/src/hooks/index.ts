import { useLogin } from "./mutations/login.hooks";
import { useRegister } from "./mutations/register.hooks";
import { useTaskQuery } from "./queries/tasks-getquery.hook";
import { useUserQuery } from "./queries/users-getquery.hook";
import { useTaskCreate } from "./mutations/task-create.hooks";

export {
    useLogin,
    useRegister,
    useTaskQuery,
    useUserQuery,
    useTaskCreate,
}