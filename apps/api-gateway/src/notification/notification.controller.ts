import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  CommentCreatedEventDto,
  TaskCreatedEventDto,
  TaskUpdatedEventDto,
} from '@app/common';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notification: NotificationService) {}

  @EventPattern('internal:notify')
  handleNotify(
    @Payload()
    data: {
      id: string;
      userId: string;
      event: string;
      payload: {
        message: string;
        data:
          | TaskCreatedEventDto
          | TaskUpdatedEventDto
          | CommentCreatedEventDto;
      };
    },
  ) {
    this.notification.sendToUser(data);
  }
}
