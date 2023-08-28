import { inject, injectable } from 'tsyringe';

import { Post } from '@models/entities/Post';
import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';

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
export class ShowPostsService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute({ userId, limit, offset }: Request): Promise<Response> {
    const allPosts = await this.postsRepository.all();

    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);

    const realOffset = offset * limit;

    const posts = await this.postsRepository.allPaginated({
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
      posts: postsFixed,
      totalPosts,
      totalPages,
      offset,
    } as Response;

    return response;
  }
}
