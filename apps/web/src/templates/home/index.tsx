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
    const [priority, setPriority] = useState<PriorityEnum | null>(null)
    const [search, setSearch] = useState<string | null>(null)
    const navigator = useNavigate()
    useAuthWebSocket()


      const handleLogout = () => {
        console.log("Usuário deslogado!");
        logout()
        navigator({ to: '/login' })
    };
    useEffect(() => {
        filterSearch(priority, search)
    }, [priority, search])

    return (
        <>
            <div className="flex flex-col p-6 bg-[#0A0A0A] text-white m-b-0">
                <header className="mb-8">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                Painel de Tarefas
                            </h1>
                            <CreateTaskDialog/>
                        </div>
                        <div className="flex items-center space-x-4">
                            
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
                                variant="ghost" // Use ghost para ser discreto
                                className="text-gray-400 hover:bg-[#1A1A1A] hover:text-red-400 p-2 transition-colors duration-200  sm:w-1/8"
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