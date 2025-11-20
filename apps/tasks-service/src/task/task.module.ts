import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskAssignee } from './entities/task-assignee.entity';
import { TaskHistory } from './entities/task-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskAssignee, TaskHistory])],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TypeOrmModule, TaskModule],
})
export class TaskModule {}
