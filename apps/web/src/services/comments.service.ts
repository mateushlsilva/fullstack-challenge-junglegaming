import { api } from "../api";
import type { CreateCommentDto } from "../schemas";
import type { CreateCommentsType, GetQueryCommentsType } from "../types";

class CommentsService {
    async getQuery({taskId, page = 1, size = 10 }: { taskId: number; page?: number; size?: number }): Promise<GetQueryCommentsType> {
        try {
            const { data } = await api.get(`/api/tasks/${taskId}/comments`, {
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

    async create(taskId: number ,body: CreateCommentDto): Promise<CreateCommentsType> {
            try {
                const { data } = await api.post(`/api/tasks/${taskId}/comments`, body);
                return data;
            }catch (err) {
                console.log(err);
                throw err;
            }
        }
}

export default new CommentsService();