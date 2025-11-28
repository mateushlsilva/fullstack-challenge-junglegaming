import { useMutation } from "@tanstack/react-query";
import { TaskService } from "../../services";
import { useTaskStore } from '@/stores';
import { toast } from "sonner"
import { StatusEnum } from "@/enums";
import type { TaskToKanban } from "@/types";
import { AxiosError } from "axios";

type kanban = {
  id: string;
  status: StatusEnum;
}

export const useKanbanStatus = () => {
  const update = useTaskStore((state) => state.updateTask);
  
  return useMutation({
    mutationFn: ({ id, status }: kanban) => {
      const task = useTaskStore.getState().tasks.find(t => t.id === id.toString()) as TaskToKanban;
      const assigned_user_ids = task.assignees.map(ass => Number(ass.user_id));

    
      return TaskService.update(Number(id), { 
        taskStatus: status, 
        taskTitle: task?.name, 
        taskDescription: task?.description,
        taskDueDate: task?.dueDate,
        taskPriority: task?.priority, 
        assigned_user_ids
      });
    },

    onSuccess: (data, variables) => {
      const { id } = variables;
      const { taskStatus } = data;
      update(id.toString(), { column: taskStatus });
    },

    onError: (err) => {
      let message = "Erro desconhecido"
      if (err instanceof AxiosError) {
        if (err?.response?.data?.statusCode === 400) message = "Dados Inválidos"
        if (err?.response?.data?.statusCode === 404) message = "Task não encontrada"
      }
      toast.error(`Erro ao atualizar a task. ${message}!`)
    },
  });
};
