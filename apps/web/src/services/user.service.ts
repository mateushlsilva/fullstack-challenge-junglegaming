import { api } from "../api";
import type { GetQueryUsersType } from "../types";

class UserService {
    async getQuery({ page = 1, size = 10 }: { page?: number; size?: number }): Promise<GetQueryUsersType> {
        try {
            const { data } = await api.get(`/api/users`, {
                params: {
                    page,
                    size,
                }
            });
            return data;
        }catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export default new UserService();