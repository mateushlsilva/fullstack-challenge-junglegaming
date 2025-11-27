import { CommentsService } from "@/services"
import { useTaskStore } from "@/stores"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

type CommentsQuery = {
    taskId: number; 
    page: number; 
    size: number;
}

export const useCommentsQuery = ({ taskId , page = 1, size = 10 }: CommentsQuery) => {
  
    const  { data, isPending, error } = useQuery({
        queryKey: ['comments', page, size],
        queryFn: () => CommentsService.getQuery({ taskId ,page, size }),
    })



useEffect(() => {
    if (!error && data?.data) {
        const taskIdNumber = Number(data?.data[0]?.id);
        const task = useTaskStore.getState().tasks.find(t => Number(t.id) === taskIdNumber);
        if (!task) return;

        const oldComments = task.comment || [];

        const combined = [...oldComments, ...data.data];
        const uniqueComments = combined.filter(
            (c, index, self) => index === self.findIndex(item => item.id === c.id)
        );

        useTaskStore.getState().updateTask(taskIdNumber.toString(), {
            comment: uniqueComments
        });
    }
}, [data?.data, error]);


    return { data, isPending, error }
} 