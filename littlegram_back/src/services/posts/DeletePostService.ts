import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

import { AppError } from '@shared/errors/AppError';
import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';
import { Post } from '@models/entities/Post';

interface Request {
  userId: string;

  postId: string;
}

@injectable()
export class DeletePostService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute({ postId, userId }: Request): Promise<Post> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new AppError('Post not found');
    }

    const postIsFromUser = post.userId === userId;

    if (!postIsFromUser) {
      throw new AppError('Post is not from this user', 401);
    }

    await this.postsRepository.delete(postId);

    return post;
  }
}
