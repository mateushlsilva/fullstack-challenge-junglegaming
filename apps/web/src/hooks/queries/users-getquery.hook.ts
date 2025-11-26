import { UserService } from "@/services"
import { useUserStore } from "@/stores"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const useUserQuery = ({ page = 1, size = 20 }) => {
    const addPage = useUserStore(s => s.addPage)
    const  { data, isPending, error } = useQuery({
        queryKey: ['user', page, size],
        queryFn: () => UserService.getQuery({ page, size }),
    })

    useEffect(() => {
        if (!error && data?.data) addPage(data?.data)
    }, [data?.data, addPage, error])

    return { data, isPending, error }
} 