import {
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../../enums/notification-type.enum';
import { NotificationStatus } from '../../enums/notification-status.enum';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsString()
  commentId?: string;

  @IsOptional()
  @IsObject()
  @Type(() => Object)
  payload?: any;

  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus = NotificationStatus.UNREAD;
}
