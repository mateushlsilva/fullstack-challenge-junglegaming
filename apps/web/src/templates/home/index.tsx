import { CreateTaskDialog, Search, SelectStructure } from "@/components"
import { Separator } from "@/components/ui/separator"
import { PriorityEnum } from "@/enums"

type HomeTemplateProps = {
    children: React.ReactNode
} & React.ComponentProps<'div'>

export function HomeTemplate({ children }: HomeTemplateProps) {
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
                            
                            <Search/>
                            <SelectStructure 
                                placeholder='Selecione a Prioridade' 
                                select={[
                                    { id: PriorityEnum.LOW, label: PriorityEnum.LOW }, 
                                    { id: PriorityEnum.MEDIUM, label: PriorityEnum.MEDIUM }, 
                                    { id: PriorityEnum.HIGH, label: PriorityEnum.HIGH }, 
                                    { id: PriorityEnum.URGENT, label: PriorityEnum.URGENT }]}
                            />
                        </div>
                    </div>
                </header>
                
                <Separator className="bg-gray-700 mb-6" />
            </div>
            { children }
        </>
    )
}