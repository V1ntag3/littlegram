import { inject, injectable } from 'tsyringe';

import { ICommentsRepository } from '@models/repositories/interfaces/ICommentsRepository';
import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';

import { Comment } from '@models/entities/Comment';

import { AppError } from '@shared/errors/AppError';

interface Request {
  userId: string;

  postId: string;

  limit: number;

  offset: number;
}

@injectable()
export class ShowCommentsService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute({ userId, postId, limit, offset }: Request) {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new AppError('Post not found');
    }

    const totalComments = await this.commentsRepository.countByPostId(postId);

    const totalPosts = totalComments;
    const totalPages = Math.ceil(totalPosts / limit);

    const realOffset = offset * limit;

    const comments = await this.commentsRepository.findWithPagination(
      postId,
      limit,
      realOffset,
    );

    const commentsFixed = comments.map(comment => {
      return {
        ...comment,
        userEvaluation: comment.getUserEvaluation(userId),
        likes: comment.getLikes(),
        dislikes: comment.getDislikes(),
      } as Comment;
    });

    return {
      comments: commentsFixed,
      totalComments,
      totalPages,
      offset,
    };
  }
}
