import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskAssignee } from './entities/task-assignee.entity';
import { TaskHistory } from './entities/task-history.entity';
import { ActionEnum, CreateTaskDto } from '@app/common';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(TaskAssignee)
    private taskAssigneeRepository: Repository<TaskAssignee>,

    @InjectRepository(TaskHistory)
    private taskHistoryRepository: Repository<TaskHistory>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TaskService.name);
  }

  // GET, POST, PUT, DELETE, GETpage,size

  async findById(id: number) {
    return await this.taskRepository.findOneBy({ id });
  }

  async findAll(page: number, size: number) {
    const skip = (page - 1) * size;

    const [tasks, total] = await this.taskRepository.findAndCount({
      skip,
      take: size,
      order: { created_at: 'DESC' },
      relations: ['assignees'],
    });

    return {
      page,
      size,
      total,
      data: tasks,
    };
  }

  async createTask(data: CreateTaskDto, creator_id: number) {
    return await this.taskRepository.manager.transaction(async (manager) => {
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
    });
  }
}
