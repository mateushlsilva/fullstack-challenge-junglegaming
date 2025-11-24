import { PriorityEnum, StatusEnum } from '../../enums';

type Assignees = {
    id: number,
    user_id: string,
    assigned_at: Date,
}

type Comments = {
    id: number,
    user_id: string,
    content: string,
    created_at: Date
}

type GetTaskAssigneesAndCommentsType = {
    id: number,
    taskTitle: string,
    taskDescription: string,
    taskDueDate: Date,
    taskPriority: PriorityEnum,
    taskStatus: StatusEnum,
    created_at: Date,
    updated_at: Date,
    assignees: Assignees[],
    comments: Comments[],
}

export type GetQueryType = {
    page: number,
    size: number,
    total: number,
    data: GetTaskAssigneesAndCommentsType[],
}