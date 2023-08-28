import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';
import { IPostsEvaluationsRepository } from '@models/repositories/interfaces/IPostsEvaluationRepository';
import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';

import { AppError } from '@shared/errors/AppError';
import { PostEvaluation } from '@models/entities/PostEvaluation';

interface Request {
  isLike: boolean;

  userId: string;

  postId: string;
}

@injectable()
export class CreatePostEvaluationService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('PostsEvaluationsRepository')
    private postsEvaluationsRepository: IPostsEvaluationsRepository,
  ) {}

  public async execute({
    isLike,
    userId,
    postId,
  }: Request): Promise<PostEvaluation> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new AppError('Post not found');
    }

    const evaluationAlreadyExists =
      await this.postsEvaluationsRepository.findByUserIdAndPostId(
        userId,
        postId,
      );

    if (evaluationAlreadyExists) {
      throw new AppError('You cannot change you evaluation');
    }

    const commentEvaluation = await this.postsEvaluationsRepository.create({
      isLike,
      userId,
      postId,
    });

    return commentEvaluation;
  }
}
