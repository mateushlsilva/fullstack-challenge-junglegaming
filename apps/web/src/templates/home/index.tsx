import { CreateTaskDialog, Search, SelectStructure } from "@/components"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PriorityEnum } from "@/enums"
import { useAuthWebSocket } from "@/hooks"
import { useAuthStore, useTaskStore } from "@/stores"
import { useNavigate } from "@tanstack/react-router"
import { LogOut } from "lucide-react"
import { useEffect, useState } from "react"

type HomeTemplateProps = {
    children: React.ReactNode
} & React.ComponentProps<'div'>

export function HomeTemplate({ children }: HomeTemplateProps) {
    const filterSearch = useTaskStore((e) => e.filter)
    const logout = useAuthStore((state) => state.logout)
    const clearTask = useTaskStore((state) => state.clear)
    const [priority, setPriority] = useState<PriorityEnum | null>(null)
    const [search, setSearch] = useState<string | null>(null)
    const navigator = useNavigate()
    useAuthWebSocket()


    const handleLogout = () => {
        console.log("Usuário deslogado!");
        logout()
        clearTask()
        navigator({ to: '/login' })
    };
    useEffect(() => {
        filterSearch(priority, search)
    }, [priority, search])

    return (
        <>
            <div className="flex flex-col p-6 bg-[#0A0A0A] text-white ">
                <header className="mb-8">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                Painel de Tarefas
                            </h1>
                            <CreateTaskDialog/>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:flex-row md:items-center md:gap-4 w-full lg:w-auto">
                            
                            <Search onChange={(value) => setSearch(value.target.value)}/>
                            <SelectStructure 
                                placeholder='Selecione a Prioridade' 
                                select={[
                                    { id: 'null', label: 'Mostrar tudo' }, 
                                    { id: PriorityEnum.LOW, label: PriorityEnum.LOW }, 
                                    { id: PriorityEnum.MEDIUM, label: PriorityEnum.MEDIUM }, 
                                    { id: PriorityEnum.HIGH, label: PriorityEnum.HIGH }, 
                                    { id: PriorityEnum.URGENT, label: PriorityEnum.URGENT }]}
                                onChange={(value) => {
                                    setPriority(value === 'Mostrar tudo' ? null : value as PriorityEnum)
                                }}
                            />
                            <Button
                                variant="ghost"
                                className="text-gray-400 hover:bg-[#1A1A1A] hover:text-red-400 p-2 transition-colors duration-200"
                                onClick={handleLogout}
                                title="Sair do Sistema"
                            >
                                <LogOut className="w-5 h-5 mr-1" />
                                Sair
                            </Button>
                        </div>
                    </div>
                </header>
                
                <Separator className="bg-gray-700 mb-6" />
            </div>
            { children }
        </>
    )
}