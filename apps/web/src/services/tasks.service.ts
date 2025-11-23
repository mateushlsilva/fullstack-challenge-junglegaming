import { api } from "../api";
import type { CreateTaskDto } from "../schemas";
import type { CreateTaskType, GetQueryType, UpdateTaskType } from '../types';

class Task {
    async getById(id: number): Promise<CreateTaskType> {
        try {
            const { data } = await api.get(`/api/tasks/${id}`);
            return data;
        }catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getQuery({ page = 1, size = 10 }: { page?: number; size?: number }): Promise<GetQueryType> {
        try {
            const { data } = await api.get(`/api/tasks`, {
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

    async create(body: CreateTaskDto): Promise<CreateTaskType> {
        try {
            const { data } = await api.post(`/api/tasks`, body);
            return data;
        }catch (err) {
            console.log(err);
            throw err;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await api.delete(`/api/tasks/${id}`);
        }catch (err) {
            console.log(err);
            throw err;
        }
    }
    
    async update(id: number, body: CreateTaskDto): Promise<UpdateTaskType> {
        try {
            const { data } = await api.put(`/api/tasks/${id}`, body);
            return data;
        }catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export default new Task();