import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comments.entity';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), TaskModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [TypeOrmModule, CommentsService],
})
export class CommentsModule {}
