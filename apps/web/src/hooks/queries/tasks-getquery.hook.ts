import { TaskService } from "@/services"
import { useTaskStore } from "@/stores"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const useTaskQuery = ({ page = 1, size = 10 }) => {
    const addPage = useTaskStore(s => s.addPage)
    const  { data, isPending, error } = useQuery({
        queryKey: ['tasks', page, size],
        queryFn: () => TaskService.getQuery({ page, size }),
    })

    useEffect(() => {
        if (!error && data?.data) addPage(data?.data)
    }, [data?.data, addPage, error])

    return { data, isPending, error }
} 