import { inject, injectable } from 'tsyringe';

import { ICommentsEvaluationsRepository } from '@models/repositories/interfaces/ICommentsEvaluationRepository';
import { ICommentsRepository } from '@models/repositories/interfaces/ICommentsRepository';

import { CommentEvaluation } from '@models/entities/CommentEvaluation';

import { AppError } from '@shared/errors/AppError';
import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

interface Request {
  userId: string;

  commentId: string;

  limit: number;

  offset: number;
}

interface Response {
  commentsEvaluations: CommentEvaluation[];

  totalCommentsEvaluations: number;

  totalPages: number;

  totalLikes: number;

  totalDislikes: number;

  userEvaluation: boolean | null;

  offset: number;
}

@injectable()
export class ShowCommentsEvaluationsByCommentService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('CommentsEvaluationsRepository')
    private commentsEvaluationsRepository: ICommentsEvaluationsRepository,
  ) {}

  public async execute({
    limit,
    offset,
    commentId,
    userId,
  }: Request): Promise<Response> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const commentExists = await this.commentsRepository.findById(commentId);

    if (!commentExists) {
      throw new AppError('Comment not found');
    }

    const allComments =
      await this.commentsEvaluationsRepository.findByCommentId(commentId);

    if (limit === 0) {
      const response = {
        commentsEvaluations: allComments,
        totalCommentsEvaluations: allComments.length,
        totalPages: 1,
        offset: 0,
        totalDislikes: allComments.filter(comment => !comment.isLike).length,
        totalLikes: allComments.filter(comment => comment.isLike).length,
        userEvaluation:
          allComments.find(comment => comment.userId === userId)?.isLike ||
          null,
      } as Response;

      return response;
    }

    const totalCommentsEvaluations = allComments.length;
    const totalPages = Math.ceil(totalCommentsEvaluations / limit);

    const realOffset = offset * limit;

    const commentsEvaluations =
      await this.commentsEvaluationsRepository.findByCommentIdPaginated({
        commentId,
        limit,
        offset: realOffset,
      });

    const response = {
      commentsEvaluations,
      totalCommentsEvaluations,
      totalPages,
      offset,
      totalDislikes: allComments.filter(comment => !comment.isLike).length,
      totalLikes: allComments.filter(comment => comment.isLike).length,
      userEvaluation:
        allComments.find(comment => comment.userId === userId)?.isLike || null,
    } as Response;

    return response;
  }
}
