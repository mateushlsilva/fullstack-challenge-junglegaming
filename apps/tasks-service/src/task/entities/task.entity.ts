import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PriorityEnum, StatusEnum } from '@app/common';
import { TaskAssignee } from './task-assignee.entity';
import { TaskHistory } from './task-history.entity';
import { Comment } from 'src/comments/entities/comments.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  taskTitle: string;

  @Column({ type: 'varchar' })
  taskDescription: string;

  @Column({ type: 'timestamp', nullable: true })
  taskDueDate: Date;

  @Column({ type: 'enum', enum: PriorityEnum, default: PriorityEnum.LOW })
  taskPriority: PriorityEnum;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.TODO })
  taskStatus: StatusEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => TaskAssignee, (assign) => assign.task)
  assignees: TaskAssignee[];

  @OneToMany(() => TaskHistory, (history) => history.task)
  history: TaskHistory[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];
}
