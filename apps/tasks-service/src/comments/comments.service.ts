import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { CreateCommentDto } from '@app/common';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private repository: Repository<Comment>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CommentsService.name);
  }

  async getQuery(id: number, page: number, size: number) {
    const skip = (page - 1) * size;

    const [comments, total] = await this.repository.findAndCount({
      where: { task: { id } },
      skip,
      take: size,
      order: { created_at: 'DESC' },
      relations: ['task'],
    });

    return {
      page,
      size,
      total,
      data: comments,
    };
  }

  async createComment(data: CreateCommentDto) {
    const newComment = this.repository.create({
      content: data.content,
      task: { id: data.task_id },
      user_id: data.user_id,
    });

    const save = await this.repository.save(newComment);
    return save;
  }
}
