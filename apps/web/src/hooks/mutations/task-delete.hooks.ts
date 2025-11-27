import { useMutation } from "@tanstack/react-query";
import { TaskService } from "../../services";
import { toast } from "sonner"



export const useTaskDelete = () => {

  return useMutation({
    mutationFn: (id: number) => TaskService.delete(id),

    onSuccess: () => {
      toast.success('Task Deletada!')
    },

    onError: (err) => {
      let message = "Erro desconhecido"
      if (err?.response?.data?.statusCode === 400) message = "Dados Inválidos"
      if (err?.response?.data?.statusCode === 404) message = "Task não encontrada"
     
      console.error("Erro ao deletar a task:", message);
      toast.error(`Erro ao deletar a task. ${message}!`)
    },
  });
};
