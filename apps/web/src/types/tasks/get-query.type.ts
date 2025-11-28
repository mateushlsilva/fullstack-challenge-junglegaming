import { PriorityEnum, StatusEnum } from '../../enums';

export type Assignees = {
    id: number,
    user_id: string,
    assigned_at: Date,
    user?: {
        id?: number;
        email?: string;
        name?: string;
    }
}

export type Comments = {
    id: number,
    user_id: string,
    content: string,
    created_at: Date,
    user?: {
        id?: number;
        email?: string;
        name?: string;
    }
}

export type GetTaskAssigneesAndCommentsType = {
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


export type TaskToKanban = {
    id: string,
    name: string,
    description: string,
    dueDate: Date,
    priority: PriorityEnum,
    column: StatusEnum,
    comment: Comments[],
    assignees: Assignees[]
}