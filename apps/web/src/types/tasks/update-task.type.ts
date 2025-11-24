import { PriorityEnum, StatusEnum } from '../../enums';

type Assignees = {
    id: number,
    user_id: string,
    assigned_at: Date,
}

export type UpdateTaskType = {
    id: number,
    taskTitle: string,
    taskDescription: string,
    taskDueDate: Date,
    taskPriority: PriorityEnum,
    taskStatus: StatusEnum,
    created_at: Date,
    updated_at: Date,
    assignees: Assignees[]
}