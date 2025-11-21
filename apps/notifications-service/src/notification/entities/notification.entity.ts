import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationStatus, NotificationType } from '@app/common';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  userId: string;

  @Column({ nullable: true })
  taskId?: string;

  @Column({ nullable: true })
  commentId?: string;

  @Column({ type: 'jsonb', nullable: true })
  payload?: any;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
