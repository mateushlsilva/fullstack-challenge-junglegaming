import axios from "axios";
import { env } from "../env";

const api = axios.create({
    baseURL: env.apiUrl,
    timeout: 1000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api