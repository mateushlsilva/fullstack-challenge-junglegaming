/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import {
  CommentCreatedEventDto,
  TaskCreatedEventDto,
  TaskUpdatedEventDto,
} from '@app/common';

@Controller()
export class WebsocketController {
  constructor(
    private readonly webSocketService: WebsocketService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(WebsocketController.name);
  }

  @EventPattern('task.created')
  async handleNewTask(
    @Payload() data: TaskCreatedEventDto,
    @Ctx() context: RmqContext,
  ) {
    // 1. Acknowledge a mensagem da fila para que ela não seja reprocessada
    this.logger.info(
      `A task chegou para o notification service: ${data.taskTitle}`,
    );
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    this.logger.info(`Recebido evento de nova Tarefa ${data.taskTitle}`);

    const usersToNotify = data.assigned_user_ids || [];
    usersToNotify.forEach((userId) => {
      this.webSocketService.emitNotication(userId.toString(), 'task:created', {
        message: `Nova tarefa: ${data.taskTitle}`,
        ...data,
      });
    });
  }
  @EventPattern('task.updated')
  async handleUpdatedTask(
    @Payload() data: TaskUpdatedEventDto,
    @Ctx() context: RmqContext,
  ) {
    // 1. Acknowledge a mensagem da fila para que ela não seja reprocessada
    this.logger.info(
      `A task chegou para o notification service: ${data.taskTitle}`,
    );
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    this.logger.info(`Recebido evento de atualizar a Tarefa ${data.taskTitle}`);

    const usersToNotify = data.assigned_user_ids || [];
    usersToNotify.forEach((userId) => {
      this.webSocketService.emitNotication(userId.toString(), 'task:updated', {
        message: `Atualização na tarefa: ${data.taskTitle}`,
        ...data,
      });
    });
  }

  @EventPattern('task.comment.created')
  async handleNewComment(
    @Payload() data: CommentCreatedEventDto,
    @Ctx() context: RmqContext,
  ) {
    // 1. Acknowledge a mensagem da fila para que ela não seja reprocessada
    this.logger.info(
      `O comment chegou para o notification service: ${data.content}`,
    );
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    this.logger.info(`Recebido evento de novo Comment ${data.content}`);

    const usersToNotify = data.assigned_user_ids || [];
    usersToNotify.forEach((userId) => {
      this.webSocketService.emitNotication(userId.toString(), 'comment:new', {
        message: `Novo comentario: ${data.content}`,
        ...data,
      });
    });
  }
}
