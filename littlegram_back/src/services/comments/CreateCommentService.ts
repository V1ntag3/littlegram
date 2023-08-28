import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';
import { ICommentsRepository } from '@models/repositories/interfaces/ICommentsRepository';
import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';

import { Comment } from '@models/entities/Comment';

import { AppError } from '@shared/errors/AppError';

interface Request {
  text: string;

  userId: string;

  postId: string;
}

@injectable()
export class CreateCommentService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute({ text, userId, postId }: Request): Promise<Comment> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new AppError('Post not found');
    }

    const comment = await this.commentsRepository.create({
      text,
      userId,
      postId,
    });

    return comment;
  }
}
