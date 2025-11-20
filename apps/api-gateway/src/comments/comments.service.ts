import { CreateCommentDto } from '@app/common';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { COMMENTS_SERVICE } from './comments.constants';

interface Error {
  code: number;
  message: string;
}

@Injectable()
export class CommentsService implements OnModuleInit {
  constructor(
    @Inject(COMMENTS_SERVICE) private readonly commentsClient: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.commentsClient.connect();
  }

  async query(taskId: number, page: number, size: number) {
    try {
      const res = await lastValueFrom(
        this.commentsClient.send<CreateCommentDto>(
          { cmd: 'page_comments' },
          { taskId, page, size },
        ),
      );

      return res;
    } catch (error: unknown) {
      const err: Error = error as Error;
      console.error(error);
      if (err.code == 401) {
        throw new UnauthorizedException();
      }

      throw new InternalServerErrorException(
        err?.message || 'Erro inesperado no gateway',
      );
    }
  }

  async post(taskId: number, data: CreateCommentDto) {
    try {
      const res = await lastValueFrom(
        this.commentsClient.send<CreateCommentDto>(
          { cmd: 'create_comments' },
          { taskId, ...data },
        ),
      );

      return res;
    } catch (error: unknown) {
      const err: Error = error as Error;
      console.error(err);
      if (err.code == 401) {
        throw new UnauthorizedException();
      }

      if (err.code == 404) {
        console.error('O not found foi aqui');
        throw new NotFoundException(err.message || 'Essa Task não existe.');
      }
      throw new InternalServerErrorException(
        err?.message || 'Erro inesperado no gateway',
      );
    }
  }
}
