/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from "../services";
import { useAuthStore } from "../stores";
import api from "./api";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se deu 401 e ainda não tentou o refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { setAuth, logout, user } = useAuthStore.getState();

      if (isRefreshing) {
        // espera o refresh terminar
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const data = await AuthService.refresh();

        const newAccessToken = data.refresh.access_token;
        let userEmail = ''
        if (user?.userEmail) userEmail = user.userEmail 
        // salva no zustand
        setAuth(newAccessToken, { userEmail });

        // seta no axios
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
)