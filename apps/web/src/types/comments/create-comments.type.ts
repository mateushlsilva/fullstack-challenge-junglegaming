export type CreateCommentsType = {
    id: number,
    task: {
        id: number
    },
    user_id: number,
    content: string,
    created_at: Date,
}