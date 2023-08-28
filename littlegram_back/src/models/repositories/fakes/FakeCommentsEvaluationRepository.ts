import { IShowByCommentIdPaginatedDTO } from '@models/dtos/IShowByCommentIdPaginatedDTO';
import { CommentEvaluation } from '@models/entities/CommentEvaluation';
import { v4 } from 'uuid';
import { ICommentsEvaluationsRepository } from '../interfaces/ICommentsEvaluationRepository';

class FakeCommentsEvaluationRepository
  implements ICommentsEvaluationsRepository
{
  private commentsEvaluations: CommentEvaluation[] = [];

  public async findById(id: string): Promise<CommentEvaluation | null> {
    const findCommentEvaluation = this.commentsEvaluations.find(
      commentEvaluation => commentEvaluation.id === id,
    );

    return findCommentEvaluation || null;
  }

  public async findByCommentId(
    commentId: string,
  ): Promise<CommentEvaluation[]> {
    const findCommentEvaluations = this.commentsEvaluations.filter(
      commentEvaluation => commentEvaluation.commentId === commentId,
    );

    return findCommentEvaluations;
  }

  public async findByCommentIdPaginated(
    data: IShowByCommentIdPaginatedDTO,
  ): Promise<CommentEvaluation[]> {
    const findCommentsEvaluation = this.commentsEvaluations.filter(
      commentEvaluation => commentEvaluation.commentId === data.commentId,
    );

    const skip = data.offset * data.limit;
    const take = data.limit;

    const commentsEvaluation = findCommentsEvaluation.slice(skip, skip + take);

    return commentsEvaluation;
  }

  public async findByUserId(
    userId: string,
  ): Promise<CommentEvaluation[] | null> {
    const findCommentEvaluations = this.commentsEvaluations.filter(
      commentEvaluation => commentEvaluation.userId === userId,
    );

    return findCommentEvaluations || null;
  }

  public async findByUserIdAndCommentId(
    userId: string,
    commentId: string,
  ): Promise<CommentEvaluation | null> {
    const findCommentEvaluation = this.commentsEvaluations.find(
      commentEvaluation =>
        commentEvaluation.userId === userId &&
        commentEvaluation.commentId === commentId,
    );

    return findCommentEvaluation || null;
  }

  public async create(
    commentEvaluationData: CommentEvaluation,
  ): Promise<CommentEvaluation> {
    const commentEvaluation = new CommentEvaluation();

    Object.assign(commentEvaluation, { id: v4() }, commentEvaluationData);

    this.commentsEvaluations.push(commentEvaluation);

    return commentEvaluation;
  }

  public async save(
    commentEvaluation: CommentEvaluation,
  ): Promise<CommentEvaluation> {
    const findIndex = this.commentsEvaluations.findIndex(
      findCommentEvaluation =>
        findCommentEvaluation.id === commentEvaluation.id,
    );

    this.commentsEvaluations[findIndex] = commentEvaluation;

    return commentEvaluation;
  }

  public async all(): Promise<CommentEvaluation[]> {
    return this.commentsEvaluations;
  }

  public async delete(commentEvaluationId: string): Promise<void> {
    this.commentsEvaluations = this.commentsEvaluations.filter(
      commentEvaluation => commentEvaluation.id !== commentEvaluationId,
    );
  }
}

export { FakeCommentsEvaluationRepository };
