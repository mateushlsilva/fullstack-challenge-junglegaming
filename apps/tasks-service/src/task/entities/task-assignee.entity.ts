import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('task_assignees')
export class TaskAssignee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.assignees, { onDelete: 'CASCADE' })
  task: Task;

  @Column({ type: 'bigint' })
  user_id: number;

  @CreateDateColumn()
  assigned_at: Date;
}
