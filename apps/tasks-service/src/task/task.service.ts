import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { In, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskAssignee } from './entities/task-assignee.entity';
import { TaskHistory } from './entities/task-history.entity';
import { ActionEnum, CreateTaskDto, UpdateTaskDto } from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from './notification.constants';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskAssignee)
    private taskAssigneeRepository: Repository<TaskAssignee>,
    private readonly logger: PinoLogger,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {
    this.logger.setContext(TaskService.name);
  }

  async findById(id: number, creator_id: number) {
    const find = await this.taskRepository.findOneBy({
      id,
      assignees: { user_id: creator_id },
    });
    if (!find) {
      throw new RpcException({
        code: 404,
        message: 'Task não encontrada',
      });
    }
    return find;
  }

  async findAll(page: number, size: number, creator_id: number) {
    const skip = (page - 1) * size;

    const [tasks, total] = await this.taskRepository.findAndCount({
      skip,
      take: size,
      order: { created_at: 'DESC' },
      relations: { assignees: true, comments: true },
      where: { assignees: { user_id: creator_id } },
    });

    return {
      page,
      size,
      total,
      data: tasks,
    };
  }

  async createTask(data: CreateTaskDto, creator_id: number) {
    return await this.taskRepository.manager
      .transaction(async (manager) => {
        const newTask = manager.create(Task, {
          taskTitle: data.taskTitle,
          taskDescription: data.taskDescription,
          taskDueDate: new Date(data.taskDueDate),
          taskPriority: data.taskPriority,
          taskStatus: data.taskStatus,
        });

        const savedTask = await manager.save(newTask);

        // Associa o creator
        const creatorAssignee = manager.create(TaskAssignee, {
          task: savedTask,
          user_id: creator_id,
        });
        await manager.save(creatorAssignee);

        // Associa os outros usuários (exceto o creator)
        const otherUserIds =
          data.assigned_user_ids?.filter((id) => id !== creator_id) || [];
        if (otherUserIds.length) {
          const assignees = otherUserIds.map((userId) =>
            manager.create(TaskAssignee, {
              task: savedTask,
              user_id: userId,
            }),
          );
          await manager.save(assignees);
        }

        const history = manager.create(TaskHistory, {
          task: savedTask,
          user_id: creator_id,
          new_value: savedTask,
          action: ActionEnum.CREATED,
        });
        await manager.save(history);

        return savedTask;
      })
      .then(async (savedTask) => {
        this.logger.info(
          `Entrando no then da criação da task: ${savedTask.taskTitle}`,
        );
        // Buscar todos os usuários associados à task
        const assignedUsers = await this.taskAssigneeRepository.find({
          where: { task: { id: savedTask.id } },
        });

        const userIds = assignedUsers.map((a) => a.user_id);

        // 2. Enviar o evento para o Notification Service
        this.notificationClient.emit('task.created', {
          id: savedTask.id,
          taskTitle: savedTask.taskTitle,
          creatorId: creator_id,
          assigned_user_ids: userIds,
          taskPriority: savedTask.taskPriority,
          taskStatus: savedTask.taskStatus,
          taskDescription: savedTask.taskDescription,
          taskDueDate: savedTask.taskDueDate,
        });

        this.logger.info(
          `Task enviada para o notification: ${savedTask.taskTitle}`,
        );

        return savedTask;
      });
  }

  async delete(id: number, creator_id: number) {
    this.logger.info(`[TaskService] Tentativa de deletar Task ID: ${id}`);
    const find = await this.taskRepository.findOneBy({
      id,
      assignees: { user_id: creator_id },
    });
    if (!find) {
      throw new RpcException({
        code: 404,
        message: 'Task não encontrada',
      });
    }
    const del = await this.taskRepository.delete({ id });
    this.logger.info(
      `[TypeORM Result] Linhas Afetadas (affected): ${del.affected}`,
    );
    if (del.affected === 0) {
      throw new RpcException({
        code: 404,
        message: 'Task não encontrada',
      });
    }
    return del;
  }

  async updateTask(id: number, data: UpdateTaskDto, creator_id: number) {
    return await this.taskRepository.manager
      .transaction(async (manager) => {
        const task = await manager.findOne(Task, {
          where: { id },
          relations: ['assignees'],
        });

        if (!task) {
          throw new RpcException({
            code: 404,
            message: 'Task não encontrada',
          });
        }
        const old_value: Task = JSON.parse(JSON.stringify(task)) as Task;

        task.taskTitle = data.taskTitle ?? task.taskTitle;
        task.taskDescription = data.taskDescription ?? task.taskDescription;
        task.taskPriority = data.taskPriority ?? task.taskPriority;
        task.taskStatus = data.taskStatus ?? task.taskStatus;
        task.taskDueDate = data.taskDueDate
          ? new Date(data.taskDueDate)
          : task.taskDueDate;

        await manager.save(task);

        // Atualizar assignees
        if (data.assigned_user_ids) {
          // Lista atual vindo do banco
          const existing = task?.assignees.map((a) => Number(a.user_id));

          this.logger.info('Verifica os ids: ', existing);
          // Garante que o criador SEMPRE está no array final
          const incoming = Array.from(
            new Set([creator_id, ...data.assigned_user_ids]),
          );

          this.logger.info('Verifica os incoming: ', incoming);
          // Quem deve ser adicionado (está no incoming, mas não está no existing)
          const toAdd = incoming.filter((userId) => !existing.includes(userId));

          this.logger.info('Verifica os add: ', toAdd);
          // Quem deve ser removido (está no existing, mas não está no incoming)
          const toRemove = existing.filter(
            (userId) => !incoming.includes(userId),
          );

          this.logger.info('Verifica os remove: ', toRemove);

          // Remover os que não devem mais estar
          if (toRemove.length > 0) {
            await manager.delete(TaskAssignee, {
              task: { id: task.id },
              user_id: In(toRemove),
            });
          }

          // Criar novos assignees
          if (toAdd.length > 0) {
            const newAssignees = toAdd.map((userId) =>
              manager.create(TaskAssignee, {
                task,
                user_id: userId,
              }),
            );

            await manager.save(TaskAssignee, newAssignees);
          }
        }

        await manager.save(TaskHistory, {
          task,
          user_id: creator_id,
          action: ActionEnum.UPDATED,
          old_value: old_value,
          new_value: task,
        });

        return {
          ...task,
          assignees: await manager.find(TaskAssignee, {
            where: { task: { id } },
          }),
        };
      })
      .then(async (updatedTask) => {
        this.logger.info(
          `Entrando no then do update task: ${updatedTask.taskTitle}`,
        );

        const userIds = updatedTask.assignees.map((a) => a.user_id);

        this.notificationClient.emit('task.updated', {
          id: updatedTask.id,
          taskTitle: updatedTask.taskTitle,
          creatorId: creator_id,
          assigned_user_ids: userIds,
          taskPriority: updatedTask.taskPriority,
          taskStatus: updatedTask.taskStatus,
          taskDescription: updatedTask.taskDescription,
          taskDueDate: updatedTask.taskDueDate,
        });

        this.logger.info(
          `Task enviada para o notification: ${updatedTask.taskTitle}`,
        );

        return updatedTask;
      });
  }
}
