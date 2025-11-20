import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { CreateCommentDto } from '@app/common';
import { Task } from 'src/task/entities/task.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private repository: Repository<Comment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private readonly logger: PinoLogger,
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
    this.logger.info(`TaskID é: ${data.task_id}`);
    const find = await this.taskRepository.findOneBy({ id: data.task_id });
    this.logger.debug(`Essa é a task: ${find?.taskTitle}`);
    if (!find) {
      throw new RpcException({
        code: 404,
        message: 'Task não encontrada',
      });
    }
    const newComment = this.repository.create({
      content: data.content,
      task: { id: data.task_id },
      user_id: data.user_id,
    });

    const save = await this.repository.save(newComment);
    return save;
  }
}
