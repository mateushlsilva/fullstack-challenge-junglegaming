import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Task } from 'src/task/entities/task.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.comments, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
