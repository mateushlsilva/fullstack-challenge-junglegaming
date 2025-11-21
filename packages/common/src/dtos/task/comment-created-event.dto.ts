import { CreateCommentDto } from "./create-comments.dto";

export class CommentCreatedEventDto extends CreateCommentDto {
  id: number;
  assigned_user_ids: number[];
}
