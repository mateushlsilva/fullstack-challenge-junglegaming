type ContentUserType = {
    id: number,
    content: string,
    created_at: Date,
    user_id: string,
    user: {
        id: number,
        name: string,
        email: string
      }
};

export type GetQueryCommentsType = {
    page: number,
    size: number,
    total: null,
    data: ContentUserType[]
};