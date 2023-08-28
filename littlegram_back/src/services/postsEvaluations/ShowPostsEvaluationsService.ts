import { inject, injectable } from 'tsyringe';

import { IPostsEvaluationsRepository } from '@models/repositories/interfaces/IPostsEvaluationRepository';
import { PostEvaluation } from '@models/entities/PostEvaluation';

@injectable()
export class ShowPostsEvaluationsService {
  constructor(
    @inject('PostsEvaluationsRepository')
    private postsEvaluationsRepository: IPostsEvaluationsRepository,
  ) {}

  public async execute(): Promise<PostEvaluation[]> {
    const postsEvaluations = await this.postsEvaluationsRepository.all();

    return postsEvaluations;
  }
}
