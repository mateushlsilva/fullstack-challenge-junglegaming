import { TaskService } from "@/services"
import { useQuery } from "@tanstack/react-query"

export const useTaskGet = (id: number) => {

    const  { data, isPending, error } = useQuery({
        queryKey: ['tasksId'],
        queryFn: () => TaskService.getById(id),
        staleTime: 0,        
        gcTime: 0,           
        refetchOnMount: 'always',
    })


    return { data, isPending, error }
} 