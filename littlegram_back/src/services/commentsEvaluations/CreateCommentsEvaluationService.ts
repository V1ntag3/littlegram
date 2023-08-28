import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';
import { ICommentsRepository } from '@models/repositories/interfaces/ICommentsRepository';

import { AppError } from '@shared/errors/AppError';
import { ICommentsEvaluationsRepository } from '@models/repositories/interfaces/ICommentsEvaluationRepository';
import { CommentEvaluation } from '@models/entities/CommentEvaluation';

interface Request {
  isLike: boolean;

  userId: string;

  commentId: string;
}

@injectable()
export class CreateCommentEvaluationService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('CommentsEvaluationsRepository')
    private commentsEvaluationsRepository: ICommentsEvaluationsRepository,
  ) {}

  public async execute({
    isLike,
    userId,
    commentId,
  }: Request): Promise<CommentEvaluation> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new AppError('Post not found');
    }

    const evaluationAlreadyExists =
      await this.commentsEvaluationsRepository.findByUserIdAndCommentId(
        userId,
        commentId,
      );

    if (evaluationAlreadyExists) {
      throw new AppError('You cannot change you evaluation');
    }

    const commentEvaluation = await this.commentsEvaluationsRepository.create({
      isLike,
      userId,
      commentId,
    });

    return commentEvaluation;
  }
}
