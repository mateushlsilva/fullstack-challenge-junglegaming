import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services";
import { useAuthStore } from "../stores";
import type { RegisterDto } from "../schemas";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner"


export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (body: RegisterDto) => AuthService.register(body),

    onSuccess: (data, { userEmail }) => {
      setAuth(data.access_token, { userEmail });
      toast.success('Usuário criado!')
      navigate({ to: '/home' })
    },

    onError: (err) => {
      let message = "Erro desconhecido"
      if (err?.response?.data?.statusCode === 409) message = "O e-mail fornecido já está em uso"
      if (err?.response?.data?.statusCode === 400) message = "Dados Inválidos"
     
      console.error("Erro no register:", message);
      toast.error(`Erro ao cadastrar usuário. ${message}!`)
    },
  });
};
