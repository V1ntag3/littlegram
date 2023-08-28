/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
import { ICommentsEvaluationsRepository } from '@models/repositories/interfaces/ICommentsEvaluationRepository';
import { ICreateCommentsEvaluationDTO } from '@models/dtos/ICreateCommentsEvaluationDTO';
import { CommentEvaluation } from '@models/entities/CommentEvaluation';

export class FakeCommentsEvaluationsRepository implements ICommentsEvaluationsRepository {
  private commentsEvaluations: CommentEvaluation[] = [];

  public async findById(id: string): Promise<CommentEvaluation | null> {
    return this.commentsEvaluations.find(evaluation => evaluation.id === id) || null;
  }

  public async findByCommentId(commentId: string): Promise<CommentEvaluation[] | null> {
    return this.commentsEvaluations.filter(evaluation => evaluation.commentId === commentId) || null;
  }

  public async findByUserId(userId: string): Promise<CommentEvaluation[] | null> {
    return this.commentsEvaluations.filter(evaluation => evaluation.userId === userId) || null;
  }

  public async findByUserIdAndCommentId(userId: string, commentId: string): Promise<CommentEvaluation | null> {
    return this.commentsEvaluations.find(
      evaluation => evaluation.userId === userId && evaluation.commentId === commentId
    ) || null;
  }

  public async all(): Promise<CommentEvaluation[]> {
    return this.commentsEvaluations;
  }

  public async create(data: ICreateCommentsEvaluationDTO): Promise<CommentEvaluation> {
    const commentEvaluation = new CommentEvaluation();

    Object.assign(commentEvaluation, { id: this.commentsEvaluations.length + 1, ...data });

    this.commentsEvaluations.push(commentEvaluation);

    return commentEvaluation;
  }

  public async save(commentEvaluation: CommentEvaluation): Promise<CommentEvaluation> {
    const findIndex = this.commentsEvaluations.findIndex(evaluation => evaluation.id === commentEvaluation.id);

    this.commentsEvaluations[findIndex] = commentEvaluation;

    return commentEvaluation;
  }

  public async delete(id: string): Promise<void> {
    const findIndex = this.commentsEvaluations.findIndex(evaluation => evaluation.id === id);

    this.commentsEvaluations.splice(findIndex, 1);
  }
}
