import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services";
import { useAuthStore } from "../stores";
import type { LoginDto } from "../schemas";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner"


export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (body: LoginDto) => AuthService.login(body),

    onSuccess: (data, { userEmail }) => {
      setAuth(data.access_token, { userEmail });
      navigate({ to: '/home' })
    },

    onError: (err) => {
      console.error("Erro no login:", err);
      toast.error('Erro ao fazer login, dados inválidos!')
    },
  });
};
