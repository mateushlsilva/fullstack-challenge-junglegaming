export type UserTypeQuery = {
    id: number,
    userEmail: string,
    userName: string,
};

export type GetQueryUsersType = {
    page: number,
    size: number,
    total: number,
    data: UserTypeQuery[]
};