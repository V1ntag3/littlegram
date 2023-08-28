import { connectionSource } from '@models/database/dataSource';
import { ICreateCommentsEvaluationDTO } from '@models/dtos/ICreateCommentsEvaluationDTO';

import { CommentEvaluation } from '@models/entities/CommentEvaluation';
import { ICommentsEvaluationsRepository } from './interfaces/ICommentsEvaluationRepository';

const commentsEvaluationsRepository =
  connectionSource.getRepository(CommentEvaluation);

export const CommentsEvaluationsRepository: ICommentsEvaluationsRepository =
  commentsEvaluationsRepository.extend({
    async findById(id: string): Promise<CommentEvaluation | null> {
      const evaluation = await commentsEvaluationsRepository.findOne({
        where: {
          id,
        },
      });
      return evaluation;
    },

    async findByCommentId(commentId: string): Promise<CommentEvaluation[]> {
      const evaluations = await commentsEvaluationsRepository.find({
        where: {
          commentId,
        },
      });
      return evaluations;
    },

    async findByUserId(userId: string): Promise<CommentEvaluation[] | null> {
      const evaluations = await commentsEvaluationsRepository.find({
        where: {
          userId,
        },
      });
      return evaluations;
    },

    async findByCommentIdPaginated({
      commentId,
      limit,
      offset,
    }): Promise<CommentEvaluation[]> {
      const post = await commentsEvaluationsRepository.find({
        where: {
          commentId,
        },
        take: limit,
        skip: offset,
        order: {
          createdAt: 'DESC',
        },
      });
      return post;
    },

    async findByUserIdAndCommentId(
      userId: string,
      commentId: string,
    ): Promise<CommentEvaluation | null> {
      const evaluation = await commentsEvaluationsRepository.findOne({
        where: {
          userId,
          commentId,
        },
      });
      return evaluation;
    },

    async create(
      evaluationData: ICreateCommentsEvaluationDTO,
    ): Promise<CommentEvaluation> {
      const evaluation = commentsEvaluationsRepository.create(evaluationData);

      await commentsEvaluationsRepository.save(evaluation);

      return evaluation;
    },

    async save(evaluation: CommentEvaluation): Promise<CommentEvaluation> {
      return commentsEvaluationsRepository.save(evaluation);
    },

    async all(): Promise<CommentEvaluation[]> {
      return commentsEvaluationsRepository.find();
    },

    async delete(evaluationId: string): Promise<void> {
      commentsEvaluationsRepository.delete(evaluationId);
    },
  });
