import { TaskService } from "@/services"
import { useTaskStore, useUserStore } from "@/stores"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const useTaskQuery = ({ page = 1, size = 10 }) => {
    const addPage = useTaskStore(s => s.addPage)
    const find = useUserStore(s => s.find)
    const  { data, isPending, error } = useQuery({
        queryKey: ['tasks', page, size],
        queryFn: () => TaskService.getQuery({ page, size }),
    })

    useEffect(() => {
        if (!error && data?.data) {
        const tasksWithUsers = data.data.map(task => {
            return {
            ...task,
            assignees: task.assignees.map(a => {
                const userFind = find(a.user_id);
                return {
                ...a,
                user: userFind
                    ? {
                        id: userFind.id,
                        name: userFind.userName,
                        email: userFind.userEmail,
                    }
                    : undefined,
                };
            }),
            };
        });

        addPage(tasksWithUsers);
        }
    }, [data?.data, addPage, error, find]);

    return { data, isPending, error }
} 