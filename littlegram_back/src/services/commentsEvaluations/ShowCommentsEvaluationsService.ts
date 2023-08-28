import { inject, injectable } from 'tsyringe';

import { ICommentsEvaluationsRepository } from '@models/repositories/interfaces/ICommentsEvaluationRepository';
import { CommentEvaluation } from '@models/entities/CommentEvaluation';

@injectable()
export class ShowCommentsEvaluationsService {
  constructor(
    @inject('CommentsEvaluationsRepository')
    private commentsEvaluationsRepository: ICommentsEvaluationsRepository,
  ) {}

  public async execute(): Promise<CommentEvaluation[]> {
    const commentsEvaluations = await this.commentsEvaluationsRepository.all();

    return commentsEvaluations;
  }
}
