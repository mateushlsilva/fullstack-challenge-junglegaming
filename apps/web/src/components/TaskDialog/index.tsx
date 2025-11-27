import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { SelectStructure } from '../SelectStructure';
import { PriorityEnum, StatusEnum } from '@/enums';
import { useCommentCreate, useCommentsQuery, useTaskGet } from '@/hooks';
import { useTaskStore } from '@/stores';
import { CalendarPicker } from '../CalendarPicker';
import { Field, FieldContent, FieldLabel } from '../ui/field';
import { TaskComments } from '../TaskComments';
import { SkeletonTaskDialog } from '../SkeletonTaskDialog';


type TaskDialogProps = {
    id: string;
    onClose: () => void
}

export function TaskDialog({ id, onClose }: TaskDialogProps) {
    const { data, isPending } = useTaskGet(Number(id));
    const taskComments = useTaskStore((state) => state.tasks.find(t => t.id === id)?.comment)
    const [page, setPage] = useState(1)
    useCommentsQuery({ taskId: Number(id), page, size: 20 })
    const comment = useCommentCreate()


    useEffect(() => {
        return () => {
            console.log("DESMONTOU o dialog");
        };
    }, []);



    return (
        <Dialog defaultOpen onOpenChange={(open) => !open && onClose()}>


            <DialogTrigger asChild>
                <Button variant='ghost' />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-[#1A1A1A] border-gray-700 text-white p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Tarefa</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                {isPending ? (
                    <SkeletonTaskDialog />
                ) : (
                    <>



                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="title" className="text-left text-sm font-medium">
                                Título da Tarefa
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="title"
                                    placeholder="Ex: Implementar autenticação de usuário"
                                    className="bg-[#1A1A1A] border-gray-700 text-white w-full max-w-[650px]"
                                    defaultValue={data?.taskTitle}
                                    disabled
                                />
                            </FieldContent>
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="description" className="text-left text-sm font-medium">
                                Descrição
                            </FieldLabel>
                            <FieldContent>
                                <Textarea
                                    id="description"
                                    placeholder="Detalhes da tarefa..."
                                    className="bg-[#1A1A1A] border-gray-700 text-white w-full max-w-[650px]"
                                    defaultValue={data?.taskDescription}
                                    disabled
                                />
                            </FieldContent>
                        </Field>

                        <div className="flex gap-4">

                            <Field className="flex-1 grid gap-2">
                                <FieldLabel htmlFor="priority" className="text-left text-sm font-medium">
                                    Prioridade
                                </FieldLabel>
                                <FieldContent>
                                    <SelectStructure
                                        placeholder="Selecione a Prioridade"
                                        select={[
                                            { id: PriorityEnum.LOW, label: PriorityEnum.LOW },
                                            { id: PriorityEnum.MEDIUM, label: PriorityEnum.MEDIUM },
                                            { id: PriorityEnum.HIGH, label: PriorityEnum.HIGH },
                                            { id: PriorityEnum.URGENT, label: PriorityEnum.URGENT }
                                        ]}
                                        defaultValue={data?.taskPriority}
                                        disabled
                                    />
                                </FieldContent>
                            </Field>

                            <Field className="flex-1 grid gap-2">
                                <FieldLabel htmlFor="status" className="text-left text-sm font-medium">
                                    Status
                                </FieldLabel>
                                <FieldContent>
                                    <SelectStructure
                                        placeholder="Selecione o status"
                                        select={[
                                            { id: StatusEnum.TODO, label: StatusEnum.TODO },
                                            { id: StatusEnum.IN_PROGRESS, label: StatusEnum.IN_PROGRESS },
                                            { id: StatusEnum.REVIEW, label: StatusEnum.REVIEW },
                                            { id: StatusEnum.DONE, label: StatusEnum.DONE }
                                        ]}
                                        disabled
                                        defaultValue={data?.taskStatus}
                                    />
                                </FieldContent>
                            </Field>

                            <Field className="flex-1 grid gap-2">
                                <FieldLabel htmlFor="due_date" className="text-left text-sm font-medium">
                                    Prazo
                                </FieldLabel>
                                <FieldContent>
                                    <CalendarPicker
                                        value={data?.taskDueDate ? new Date(data.taskDueDate) : undefined}
                                    />
                                </FieldContent>
                            </Field>
                        </div>

                        <TaskComments
                            setPage={setPage}
                            comments={taskComments ?? []}
                            onAddComment={async (text) => {
                                comment.mutate({ id: Number(id), body: { content: text } })
                            }}
                        />

                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="bg-transparent border-gray-700 text-white hover:bg-gray-800">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button form='cadastro-task' type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                Salvar Tarefa
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>

        </Dialog>
    )
}