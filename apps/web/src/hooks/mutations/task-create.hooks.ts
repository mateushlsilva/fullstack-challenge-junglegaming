import { useMutation } from "@tanstack/react-query";
import { TaskService } from "../../services";
//import { useTaskStore } from "../../stores";
import type { CreateTaskDto } from "../../schemas";

import { toast } from "sonner"
import { AxiosError } from "axios";



export const useTaskCreate = () => {
  //const setTask = useTaskStore((state) => state.addPage);

  return useMutation({
    mutationFn: (body: CreateTaskDto) => TaskService.create(body),

    onSuccess: () => {
      //setTask(data);
      toast.success('Task criada!')
    },

    onError: (err) => {
      let message = "Erro desconhecido"
      if (err instanceof AxiosError) {
        if (err?.response?.data?.statusCode === 400) message = "Dados Inválidos"
      }
      console.error("Erro cadastro da task:", message);
      toast.error(`Erro ao criar a task. ${message}!`)
    },
  });
};
