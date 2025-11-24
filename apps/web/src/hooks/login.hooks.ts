import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services";
import { useAuthStore } from "../stores";
import type { LoginDto } from "../schemas";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (body: LoginDto) => AuthService.login(body),

    onSuccess: (data, { userEmail }) => {
      setAuth(data.access_token, { userEmail });
    },

    onError: (err) => {
      console.error("Erro no login:", err);
    },
  });
};
