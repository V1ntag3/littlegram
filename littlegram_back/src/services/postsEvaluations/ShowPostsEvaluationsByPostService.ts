import { inject, injectable } from 'tsyringe';

import { IPostsEvaluationsRepository } from '@models/repositories/interfaces/IPostsEvaluationRepository';

import { PostEvaluation } from '@models/entities/PostEvaluation';
import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';

import { AppError } from '@shared/errors/AppError';

interface Request {
  postId: string;

  limit: number;

  offset: number;
}

interface Response {
  postsEvaluations: PostEvaluation[];

  totalPostsEvaluations: number;

  totalPages: number;

  offset: number;
}

@injectable()
export class ShowPostsEvaluationsByPostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('PostsEvaluationsRepository')
    private postsEvaluationsRepository: IPostsEvaluationsRepository,
  ) {}

  public async execute({ limit, offset, postId }: Request): Promise<Response> {
    const postExists = await this.postsRepository.findById(postId);

    if (!postExists) {
      throw new AppError('Post not found');
    }

    const allPosts = await this.postsEvaluationsRepository.findByPostId(postId);

    if (limit === 0) {
      const response = {
        postsEvaluations: allPosts,
        totalPostsEvaluations: allPosts.length,
        totalPages: 1,
        offset: 0,
      } as Response;

      return response;
    }

    const totalPostsEvaluations = allPosts.length;
    const totalPages = Math.ceil(totalPostsEvaluations / limit);

    const realOffset = offset * limit;

    const postsEvaluations =
      await this.postsEvaluationsRepository.findByPostIdPaginated({
        postId,
        limit,
        offset: realOffset,
      });

    const response = {
      postsEvaluations,
      totalPostsEvaluations,
      totalPages,
      offset,
    } as Response;

    return response;
  }
}
