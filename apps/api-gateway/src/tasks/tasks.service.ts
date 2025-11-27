import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { TASkS_SERVICE } from './task.constants';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTaskDto, UpdateTaskDto } from '@app/common';
import { lastValueFrom } from 'rxjs';

interface Error {
  code: number;
  message: string;
}

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(
    @Inject(TASkS_SERVICE) private readonly tasksClient: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.tasksClient.connect();
  }

  async query(page: number, size: number, userId: number) {
    try {
      const res = await lastValueFrom(
        this.tasksClient.send<CreateTaskDto>(
          { cmd: 'page_task' },
          { page, size, userId },
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

  async getById(id: number, userId: number) {
    try {
      const res = await lastValueFrom(
        this.tasksClient.send<CreateTaskDto>(
          { cmd: 'getid_task' },
          { id, userId },
        ),
      );

      return res;
    } catch (error: unknown) {
      const err: Error = error as Error;
      console.error(error);
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

  async post(data: CreateTaskDto, userId: number) {
    try {
      const payload = { data, userId };
      const res = await lastValueFrom(
        this.tasksClient.send<CreateTaskDto>({ cmd: 'create_task' }, payload),
      );

      return res;
    } catch (error: unknown) {
      const err: Error = error as Error;
      console.error(err);
      if (err.code == 401) {
        throw new UnauthorizedException();
      }

      throw new InternalServerErrorException(
        err?.message || 'Erro inesperado no gateway',
      );
    }
  }

  async put(id: number, data: UpdateTaskDto, userId: number) {
    try {
      const payload = { data, userId };
      const res = await lastValueFrom(
        this.tasksClient.send<CreateTaskDto>(
          { cmd: 'put_task' },
          { id, ...payload },
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
        throw new NotFoundException(err.message || 'Essa Task não existe.');
      }

      throw new InternalServerErrorException(
        err?.message || 'Erro inesperado no gateway',
      );
    }
  }

  async delete(id: number, userId: number) {
    try {
      await lastValueFrom(
        this.tasksClient.send<CreateTaskDto>(
          { cmd: 'delete_task' },
          { id, userId },
        ),
      );

      return;
    } catch (error: unknown) {
      const err: Error = error as Error;
      console.error(error);
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
