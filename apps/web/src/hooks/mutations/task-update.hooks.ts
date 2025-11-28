import { useMutation } from "@tanstack/react-query";
import { TaskService } from "../../services";
import type { CreateTaskDto } from "../../schemas";

import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router";

type TaskUpdate = {
  id: number;
  body: CreateTaskDto
}

export const useTaskUpdate = () => {

  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ id, body }: TaskUpdate) => TaskService.update(id, body),

    onSuccess: () => {
      toast.success('Task atualiza!')
      navigate({ to: '/' })
    },

    onError: (err) => {
      let message = "Erro desconhecido"
      if (err?.response?.data?.statusCode === 400) message = "Dados Inválidos"
      if (err?.response?.data?.statusCode === 404) message = "Task não encontrada"
     
      console.error("Erro atualizar a task:", message);
      toast.error(`Erro ao atualizar a task. ${message}!`)
    },
  });
};
