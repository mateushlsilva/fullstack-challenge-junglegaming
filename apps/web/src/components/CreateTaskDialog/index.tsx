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
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { SelectStructure } from '../SelectStructure';
import { PriorityEnum, StatusEnum } from '@/enums';
import { useTaskCreate, useUserQuery } from '@/hooks';
import { useUserStore } from '@/stores';
import { MultiSelect } from '../MultiSelect';
import { CalendarPicker } from '../CalendarPicker';
import { useForm } from 'react-hook-form';
import { createTaskSchema, type CreateTaskDto } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldContent, FieldError, FieldLabel } from '../ui/field';



export function CreateTaskDialog() {
  const createTask = useTaskCreate();

  const { register, setValue, reset, handleSubmit, formState: { errors } } = useForm<CreateTaskDto>({
    resolver: zodResolver(createTaskSchema)
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date())


  const [page, setPage] = useState(1);

  useUserQuery({ page, size: 20 });

  const users = useUserStore((s) => s.users);


  const onSubmit = (data: CreateTaskDto) => {
    createTask.mutate(data);
    console.log("Nova Tarefa Criada!");
    reset()
    setSelectedUsers([])
    setDate(new Date())
    setIsDialogOpen(false);
  }

 
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-colors duration-200">
          <Plus className="w-5 h-5 mr-2" />
          Nova Tarefa
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-gray-700 text-white p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Criar Nova Tarefa</DialogTitle>
          <DialogDescription className="text-white text-sm">
            Preencha os detalhes abaixo para adicionar uma nova tarefa ao Kanban.
          </DialogDescription>
        </DialogHeader>


        <form id='cadastro-task' onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">

          <Field className="grid gap-2">
            <FieldLabel htmlFor="title" className="text-left text-sm font-medium">
              Título da Tarefa
            </FieldLabel>
            <FieldContent>
              <Input 
                id="title" 
                placeholder="Ex: Implementar autenticação de usuário" 
                className="bg-[#1A1A1A] border-gray-700 text-white" 
                required 
                {...register('taskTitle')}
              />
              <FieldError>{errors.taskTitle?.message}</FieldError>
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
                className="bg-[#1A1A1A] border-gray-700 text-white" 
                required
                {...register("taskDescription")}
                />
              <FieldError>{errors.taskDescription?.message}</FieldError>
            </FieldContent>
          </Field>

          <Field className="grid gap-2">

            <FieldLabel htmlFor="priority" className="text-left text-sm font-medium">
              Prioridade
            </FieldLabel>
            <FieldContent>
            <SelectStructure
              placeholder='Selecione a Prioridade'
              select={[
                { id: PriorityEnum.LOW, label: PriorityEnum.LOW },
                { id: PriorityEnum.MEDIUM, label: PriorityEnum.MEDIUM },
                { id: PriorityEnum.HIGH, label: PriorityEnum.HIGH },
                { id: PriorityEnum.URGENT, label: PriorityEnum.URGENT }]}
               required
               onChange={(value) => {
                const v: PriorityEnum = value as PriorityEnum
                setValue("taskPriority", v, {
                  shouldValidate: true,
                })
               }}
            />
            <FieldError>{errors.taskPriority?.message}</FieldError>
            </FieldContent>
          </Field>


             <Field className="grid gap-2">

            <FieldLabel htmlFor="status" className="text-left text-sm font-medium">
              Status
            </FieldLabel>
            <FieldContent>
            <SelectStructure
              placeholder='Selecione o status'
              select={[
                { id: StatusEnum.TODO, label: StatusEnum.TODO },
                { id: StatusEnum.IN_PROGRESS, label: StatusEnum.IN_PROGRESS },
                { id: StatusEnum.REVIEW, label: StatusEnum.REVIEW },
                { id: StatusEnum.DONE, label: StatusEnum.DONE }]}
               required
               onChange={(value) => {
                const v: StatusEnum = value as StatusEnum
                setValue("taskStatus", v, {
                  shouldValidate: true,
                })
               }}
            />
            <FieldError>{errors.taskStatus?.message}</FieldError>
            </FieldContent>
          </Field>



          <Field className="grid gap-2">
            <FieldLabel htmlFor="due_date" className="text-left text-sm font-medium">
              Prazo
            </FieldLabel>
            <FieldContent>
            <CalendarPicker value={date} 
            onChange={(newDate) => {
              setDate(newDate)
              setValue("taskDueDate", newDate, {
                shouldValidate: true,
              })
            }} 
            />
            {/* <Input id="due_date" type="date" className="bg-[#1A1A1A] border-gray-700 text-white" /> */}
                <FieldError>{errors.taskDueDate?.message}</FieldError>
                </FieldContent>
          </Field>

          <Field className="grid gap-2">
            <FieldLabel htmlFor="due_date" className="text-left text-sm font-medium">
              Usúarios
            </FieldLabel>
            <FieldContent>
            <MultiSelect
              options={users.map(u => ({
                value: u.id.toString(),
                label: u.userEmail
              }))}
              value={selectedUsers}
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


          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="bg-transparent border-gray-700 text-white hover:bg-gray-800">
                Cancelar
              </Button>
            </DialogClose>
            <Button form='cadastro-task' type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={createTask.isPending}>
              Salvar Tarefa
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}