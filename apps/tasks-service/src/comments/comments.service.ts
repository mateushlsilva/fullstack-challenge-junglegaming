import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { CreateCommentDto } from '@app/common';
import { Task } from 'src/task/entities/task.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from './notification.constants';
import { TaskAssignee } from 'src/task/entities/task-assignee.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private repository: Repository<Comment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(TaskAssignee)
    private taskAssigneeRepository: Repository<TaskAssignee>,
    private readonly logger: PinoLogger,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {
    this.logger.setContext(CommentsService.name);
  }

  async getQuery(id: number, page: number, size: number) {
    const skip = (page - 1) * size;

    // const [comments, total] = await this.repository.findAndCount({
    //   where: { task: { id } },
    //   skip,
    //   take: size,
    //   order: { created_at: 'DESC' },
    //   relations: [],
    //   select: ['id', 'user_id', 'content', 'created_at'],
    // });

    const comments: Array<{
      id: number;
      content: string;
      created_at: string;
      user_id: number;
      user: {
        id: number;
        name: string;
        email: string;
      };
    }> = await this.repository.query(
      `
      SELECT 
        c.id,
        c.content,
        c.created_at,
        c.user_id,
        json_build_object(
          'id', u.id,
          'name', u."userName",
          'email', u."userEmail"
        ) AS user
      FROM comments c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c."taskId" = $1
      ORDER BY c.created_at DESC
      LIMIT $2 OFFSET $3
    `,
      [id, size, skip],
    );

    const [{ count }]: Array<{ count: number | string }> =
      await this.repository.query(
        `SELECT COUNT(*)::int as count FROM comments WHERE "taskId" = $1`,
        [id],
      );
    const total = Number(count);
    return {
      page,
      size,
      total,
      data: comments,
    };
  }

  async createComment(data: CreateCommentDto) {
    return await this.taskRepository.manager
      .transaction(async (manager) => {
        this.logger.info(`TaskID é: ${data.task_id}`);
        const find = await manager.findOneBy(Task, { id: data.task_id });
        this.logger.debug(`Essa é a task: ${find?.taskTitle}`);
        if (!find) {
          throw new RpcException({
            code: 404,
            message: 'Task não encontrada',
          });
        }
        const newComment = manager.create(Comment, {
          content: data.content,
          task: { id: data.task_id },
          user_id: data.user_id,
        });

        const save = await this.repository.save(newComment);
        return save;
      })
      .then(async (saved) => {
        this.logger.info(
          `Entrando no then da criação do comentário: ${saved.content}`,
        );

        const assignedUsers = await this.taskAssigneeRepository.find({
          where: { task: { id: saved.task.id } },
        });

        const userIds = assignedUsers.map((a) => a.user_id);

        this.notificationClient.emit('task.comment.created', {
          id: saved.id,
          task_id: saved.task.id,
          user_id: saved.user_id,
          assigned_user_ids: userIds,
          content: saved.content,
        });

        this.logger.info(
          `Comentário enviado para o notification: ${saved.content}`,
        );
        return saved;
      });
  }
}
