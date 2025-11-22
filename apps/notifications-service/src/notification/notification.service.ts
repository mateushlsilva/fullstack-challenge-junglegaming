import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import {
  CommentCreatedEventDto,
  CreateNotificationDto,
  NotificationStatus,
  NotificationType,
  TaskCreatedEventDto,
  TaskUpdatedEventDto,
} from '@app/common';
import { GATEWAY_SERVICE } from './gateway.constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Notification)
    private repository: Repository<Notification>,

    @Inject(GATEWAY_SERVICE)
    private readonly gatewayClient: ClientProxy,
  ) {
    this.logger.setContext(NotificationService.name);
  }

  async emitNotication(
    userId: string,
    event: string,
    type: NotificationType,
    payload: {
      message: string;
      data: TaskCreatedEventDto | TaskUpdatedEventDto | CommentCreatedEventDto;
    },
    taskId?: string,
    commentId?: string,
  ) {
    this.logger.info(
      `Esse é o UserID: ${userId} esse é o event: ${event} esse é o payload: ${payload.message}`,
    );

    const save = await this.postNotifications({
      payload,
      status: NotificationStatus.UNREAD,
      type: type,
      userId,
      taskId,
      commentId,
    });

    this.gatewayClient.emit('internal:notify', {
      userId,
      event,
      payload,
      id: save.id,
    });
  }

  async postNotifications(data: CreateNotificationDto) {
    const createNotification = this.repository.create(data);
    return await this.repository.save(createNotification);
  }

  async findStatusUnread(userId: string) {
    return await this.repository.find({
      where: { userId: userId, status: NotificationStatus.UNREAD },
    });
  }

  async patchStatus(id: string) {
    const find = await this.repository.findOneBy({ id });
    if (!find) {
      return null;
    }
    find.status = NotificationStatus.READ;
    return await this.repository.save(find);
  }
}
