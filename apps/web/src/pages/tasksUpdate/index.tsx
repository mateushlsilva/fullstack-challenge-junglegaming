import { MultiSelect, SelectStructure } from "@/components"
import { CalendarPicker } from "@/components/CalendarPicker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PriorityEnum, StatusEnum } from "@/enums"
import { useTaskUpdate, useUserQuery } from "@/hooks"
import { createTaskSchema, type CreateTaskDto } from "@/schemas"
import { useTaskStore, useUserStore } from "@/stores"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

type TaskUpdatePageProps = {
    id: number
}

export default function TaskUpdatePage({ id }: TaskUpdatePageProps) {
    const task = useTaskStore((state) => state.tasks.find(t => t.id === id.toString()))
    const [page, setPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const users = useUserStore((s) => s.users);
    const [date, setDate] = useState<Date | null>(null)

    const update = useTaskUpdate();



    useUserQuery({ page, size: 20 });

    const { register, setValue, handleSubmit, formState: { errors } } = useForm<CreateTaskDto>({
        resolver: zodResolver(createTaskSchema)
    })

    if(task) {
        setValue("taskPriority", task.priority)
        setValue("taskStatus", task.column)
        setValue("taskDueDate", new Date(task.dueDate))
    }

    const defaultSelectedUsers = useMemo(() => {
        if (!task) return [];
        return task.assignees
            .map(a => a.user?.id?.toString())
            .filter((id): id is string => Boolean(id)); 
    }, [task]);


    const onSubmit = (body: CreateTaskDto) => {
        update.mutate({ id, body })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen  p-4">

            <Card className="w-full max-w-[700px] bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white">Atulizar a Task</CardTitle>
                    <CardDescription className="text-white">
                        Insira as informações abaixo para atualizar a task
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <form id='atualizar-form' onSubmit={handleSubmit(onSubmit)}>
                    <Field className="grid gap-2">
                        <FieldLabel htmlFor="title" className="text-left text-sm font-medium text-white">
                            Título da Tarefa
                        </FieldLabel>
                        <FieldContent>
                            <Input
                                id="title"
                                placeholder="Ex: Implementar autenticação de usuário"
                                className="bg-[#1A1A1A] border-gray-700 text-white w-full"
                                defaultValue={task?.name}
                                required
                                {...register("taskTitle")}
                            />
                            <FieldError>{errors.taskTitle?.message}</FieldError>
                        </FieldContent>
                    </Field>

                    <Field className="grid gap-2 mt-4">
                        <FieldLabel htmlFor="description" className="text-left text-sm font-medium text-white">
                            Descrição
                        </FieldLabel>
                        <FieldContent>
                            <Textarea
                                id="description"
                                placeholder="Detalhes da tarefa..."
                                className="bg-[#1A1A1A] border-gray-700 text-white w-full"
                                defaultValue={task?.description}
                                required
                                {...register("taskDescription")}
                            />
                            <FieldError>{errors.taskDescription?.message}</FieldError>
                        </FieldContent>
                    </Field>

                    <div className="flex gap-4 mt-4">
                        <Field className="flex-1 grid gap-2">
                            <FieldLabel htmlFor="priority" className="text-left text-sm font-medium text-white">
                                Prioridade
                            </FieldLabel>
                            <FieldContent>
                                <SelectStructure
                                    placeholder="Selecione a Prioridade"
                                    select={[
                                        { id: PriorityEnum.LOW, label: PriorityEnum.LOW },
                                        { id: PriorityEnum.MEDIUM, label: PriorityEnum.MEDIUM },
                                        { id: PriorityEnum.HIGH, label: PriorityEnum.HIGH },
                                        { id: PriorityEnum.URGENT, label: PriorityEnum.URGENT },
                                    ]}
                                    defaultValue={task?.priority}
                                    required
                                    onChange={(value) => {
                                        setValue("taskPriority", value as PriorityEnum, { shouldValidate: true });
                                    }}
                                />
                                <FieldError>{errors.taskPriority?.message}</FieldError>
                            </FieldContent>
                        </Field>

                        <Field className="flex-1 grid gap-2">
                            <FieldLabel htmlFor="status" className="text-left text-sm font-medium text-white">
                                Status
                            </FieldLabel>
                            <FieldContent>
                                <SelectStructure
                                    placeholder="Selecione o status"
                                    select={[
                                        { id: StatusEnum.TODO, label: StatusEnum.TODO },
                                        { id: StatusEnum.IN_PROGRESS, label: StatusEnum.IN_PROGRESS },
                                        { id: StatusEnum.REVIEW, label: StatusEnum.REVIEW },
                                        { id: StatusEnum.DONE, label: StatusEnum.DONE },
                                    ]}
                                    defaultValue={task?.column}
                                    required
                                    onChange={(value) => {
                                        setValue("taskStatus", value as StatusEnum, { shouldValidate: true });
                                    }}
                                />
                                <FieldError>{errors.taskStatus?.message}</FieldError>
                            </FieldContent>
                        </Field>




                    </div>
                    <div className="gap-2 flex mt-4">
                        <Field className="flex-1 grid gap-2">
                            <FieldLabel htmlFor="due_date" className="text-left text-sm font-medium text-white">
                                Usúarios
                            </FieldLabel>
                            <FieldContent>
                                <MultiSelect
                                    options={users.map(u => ({
                                        value: u.id.toString(),
                                        label: u.userEmail
                                    }))}
                                    value={selectedUsers}
                                    defaultValue={defaultSelectedUsers}
                                    onChange={(values) => {
                                        setSelectedUsers(values);
                                        // salva no RHF
                                        setValue("assigned_user_ids", values.map(Number), {
                                            shouldValidate: true,
                                        });
                                    }}
                                    placeholder="Selecionar responsáveis"
                                    onEndReached={() => setPage((p) => p + 1)}
                                />
                                <FieldError>{errors.assigned_user_ids?.message}</FieldError>
                            </FieldContent>
                        </Field>
                        <Field className="flex-1 grid gap-2">
                            <FieldLabel htmlFor="due_date" className="text-left text-sm font-medium text-white">
                                Prazo
                            </FieldLabel>
                            <FieldContent>
                                <CalendarPicker
                                    value={date ? date: task?.dueDate ? new Date(task?.dueDate) : undefined}
                                      onChange={(newDate) => {
                                        setDate(newDate)
                                        setValue("taskDueDate", newDate, {
                                            shouldValidate: true,
                                        })
                                    }} 
                                />
                                <FieldError>{errors.taskDueDate?.message}</FieldError>
                            </FieldContent>
                        </Field>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button form='atualizar-form' type="submit" className="w-full" disabled={update.isPending}>
                        Atualizar
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );

}