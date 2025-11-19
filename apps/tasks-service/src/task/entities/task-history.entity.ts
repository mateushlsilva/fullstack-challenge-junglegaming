import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { ActionEnum } from '@app/common';

@Entity('task_history')
export class TaskHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'enum', enum: ActionEnum })
  action: ActionEnum;

  @Column({ type: 'json', nullable: true })
  old_value: any;

  @Column({ type: 'json', nullable: true })
  new_value: any;

  @CreateDateColumn()
  created_at: Date;
}
