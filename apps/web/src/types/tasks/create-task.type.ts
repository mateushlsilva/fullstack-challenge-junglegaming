import { StatusEnum, PriorityEnum } from '@app/common';

export type CreateTaskType = {
    id: number,
    taskTitle: string,
    taskDescription: string,
    taskDueDate: Date,
    taskPriority: PriorityEnum,
    taskStatus: StatusEnum,
    created_at: Date,
    updated_at: Date
}