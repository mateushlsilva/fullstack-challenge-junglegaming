import { CreateTaskDialog } from "@/components"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuthStore, useTaskStore } from "@/stores"
import { useNavigate } from "@tanstack/react-router"
import { LogOut } from "lucide-react"


type TaskUpdateProps = {
    children: React.ReactNode
} & React.ComponentProps<'div'>

export function TaskUpdateTemplate({ children }: TaskUpdateProps) {
    const logout = useAuthStore((state) => state.logout)
    const clearTask = useTaskStore((state) => state.clear)

    const navigator = useNavigate()

    const handleLogout = () => {
        console.log("Usuário deslogado!");
        logout()
        clearTask()
        navigator({ to: '/login' })
    };
  

    return (
        <>
            <div className="flex flex-col p-6 bg-[#0A0A0A] text-white m-b-0">
                <header className="mb-8">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white" onClick={() => navigator({ to: '/' })}>
                                Painel de Tarefas
                            </h1>
                            <CreateTaskDialog/>
                        </div>
                        <div className="flex items-center">
                            
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