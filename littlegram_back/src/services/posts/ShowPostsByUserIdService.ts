import { inject, injectable } from 'tsyringe';

import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';
import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

import { Post } from '@models/entities/Post';

import { AppError } from '@shared/errors/AppError';

interface Request {
  userId: string;

  limit: number;

  offset: number;
}

interface Response {
  posts: Post[];

  totalPosts: number;

  totalPages: number;

  offset: number;
}

@injectable()
export class ShowPostsByUserIdService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId, limit, offset }: Request): Promise<Response> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const allPosts = await this.postsRepository.findByUserId(userId);

    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);

    const realOffset = offset * limit;

    const posts = await this.postsRepository.findByUserIdPaginated({
      userId,
      limit,
      offset: realOffset,
    });

    const postsFixed = posts.map(post => {
      return {
        ...post,
        userEvaluation: post.getUserEvaluation(userId),
        likes: post.getLikes(),
        dislikes: post.getDislikes(),
      } as Post;
    });


    const response = {
      posts:postsFixed,
      totalPosts,
      totalPages,
      offset,
    } as Response;

    return response;
  }
}
