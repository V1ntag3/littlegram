import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

import { ICommentsRepository } from '@models/repositories/interfaces/ICommentsRepository';
import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';
import { Comment } from '@models/entities/Comment';

import { AppError } from '@shared/errors/AppError';

interface Request {
  userId: string;

  commentId: string;

  postId: string;
}

@injectable()
export class DeleteCommentService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute({
    commentId,
    userId,
    postId,
  }: Request): Promise<Comment> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new AppError('Photo not found');
    }

    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found');
    }

    if (post.userId !== userId) {
      throw new AppError('You cannot delete this comment', 401);
    }

    await this.commentsRepository.delete(comment.id);

    return comment;
  }
}
