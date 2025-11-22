/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import {
  CommentCreatedEventDto,
  NotificationType,
  TaskCreatedEventDto,
  TaskUpdatedEventDto,
} from '@app/common';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(NotificationController.name);
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
    for (const userId of usersToNotify) {
      await this.notificationService.emitNotication(
        userId.toString(),
        'task:created',
        NotificationType.TASK_CREATED,
        { message: `Nova tarefa: ${data.taskTitle}`, data },
        data.id.toString(),
      );
    }
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
    for (const userId of usersToNotify) {
      await this.notificationService.emitNotication(
        userId.toString(),
        'task:updated',
        NotificationType.TASK_UPDATED,
        {
          message: `Atualização na tarefa: ${data.taskTitle}`,
          data,
        },
        data.id.toString(),
      );
    }
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
    for (const userId of usersToNotify) {
      await this.notificationService.emitNotication(
        userId.toString(),
        'comment:new',
        NotificationType.COMMENT_NEW,
        {
          message: `Novo comentario: ${data.content}`,
          data,
        },
        data.task_id?.toString(),
        data.id.toString(),
      );
    }
  }

  @MessagePattern({ cmd: 'notify_find' })
  async handleFindNotUnread(@Payload() userId: string) {
    return await this.notificationService.findStatusUnread(userId);
  }

  @EventPattern('notify.status')
  async handlePatchStatus(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    return await this.notificationService.patchStatus(id);
  }
}
