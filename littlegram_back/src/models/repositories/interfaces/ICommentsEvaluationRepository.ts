import { ICreateCommentsEvaluationDTO } from '@models/dtos/ICreateCommentsEvaluationDTO';
import { IShowByCommentIdPaginatedDTO } from '@models/dtos/IShowByCommentIdPaginatedDTO';
import { CommentEvaluation } from '@models/entities/CommentEvaluation';

export interface ICommentsEvaluationsRepository {
  findById(id: string): Promise<CommentEvaluation | null>;
  findByCommentId(commentId: string): Promise<CommentEvaluation[]>;
  findByCommentIdPaginated(
    data: IShowByCommentIdPaginatedDTO,
  ): Promise<CommentEvaluation[]>;

  findByUserId(userId: string): Promise<CommentEvaluation[] | null>;
  findByUserIdAndCommentId(
    userId: string,
    commentId: string,
  ): Promise<CommentEvaluation | null>;

  all(): Promise<CommentEvaluation[]>;
  create(data: ICreateCommentsEvaluationDTO): Promise<CommentEvaluation>;
  save(commentEvaluation: CommentEvaluation): Promise<CommentEvaluation>;
  delete(id: string): Promise<void>;
}
