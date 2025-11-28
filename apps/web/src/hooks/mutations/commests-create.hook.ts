import { useMutation } from "@tanstack/react-query";
import { CommentsService } from "../../services";
import type { CreateCommentDto } from "../../schemas";

import { toast } from "sonner"
import { AxiosError } from "axios";

type CommentCreateProps = {
    id: number;
    body: CreateCommentDto;
}

export const useCommentCreate = () => {

  return useMutation({
    mutationFn: ({ id ,body }: CommentCreateProps) => CommentsService.create(id, body),

    onSuccess: () => {
      toast.success('Comentário criado!')
    },

    onError: (err) => {
      let message = "Erro desconhecido"
      if (err instanceof AxiosError) {
        if (err?.response?.data?.statusCode === 400) message = "Dados Inválidos"
      }
     
      console.error("Erro cadastro do Comentário:", message);
      toast.error(`Erro ao criar o comentário. ${message}!`)
    },
  });
};
