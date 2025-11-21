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
  async handleNotify(
    @Payload()
    data: {
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
    console.log("Chegou aqui11111111111");
    await this.notification.sendToUser(data);
  }
}
