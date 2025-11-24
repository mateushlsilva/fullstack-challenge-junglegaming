import { api } from "../api";
import type { LoginDto, RefreshDto, RegisterDto } from "../schemas";
import type { LoginType, RefreshType, RegisterType } from "../types";

class AuthService {
    async login(body: LoginDto): Promise<LoginType> {
        try {
            const { data } = await api.post(`/api/auth/login`, body);
            return data
        }catch(err){
            console.error(err);
            throw err;
        }
    }

    async register(body: RegisterDto): Promise<RegisterType> {
        try {
            const { data } = await api.post(`/api/auth/register`, body);
            return data
        }catch(err){
            console.error(err);
            throw err;
        }
    }

    async refresh(body: RefreshDto): Promise<RefreshType> {
        try {
            const { data } = await api.post(`/api/auth/refresh`, body);
            return data
        }catch(err){
            console.error(err);
            throw err;
        }
    }
}

export default new AuthService();