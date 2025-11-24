export type RegisterType = {
    message: string,
    user: {
        id: number,
        userEmail: string,
        userName: string
    },
    access_token: string,
    refresh_Token: string
}