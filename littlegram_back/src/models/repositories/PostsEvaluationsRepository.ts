import { connectionSource } from '@models/database/dataSource';

import { ICreatePostsEvaluationDTO } from '@models/dtos/ICreatePostsEvaluationDTO';
import { PostEvaluation } from '@models/entities/PostEvaluation';

import { IPostsEvaluationsRepository } from './interfaces/IPostsEvaluationRepository';

const postsEvaluationsRepository =
  connectionSource.getRepository(PostEvaluation);

export const PostsEvaluationsRepository: IPostsEvaluationsRepository =
  postsEvaluationsRepository.extend({
    async findById(id: string): Promise<PostEvaluation | null> {
      const evaluation = await postsEvaluationsRepository.findOne({
        where: {
          id,
        },
      });
      return evaluation;
    },

    async findByPostId(postId: string): Promise<PostEvaluation[]> {
      const evaluations = await postsEvaluationsRepository.find({
        where: {
          postId,
        },
      });
      return evaluations;
    },

    async findByUserId(userId: string): Promise<PostEvaluation[] | null> {
      const evaluations = await postsEvaluationsRepository.find({
        where: {
          userId,
        },
      });
      return evaluations;
    },

    async findByUserIdAndPostId(
      userId: string,
      postId: string,
    ): Promise<PostEvaluation | null> {
      const evaluation = await postsEvaluationsRepository.findOne({
        where: {
          userId,
          postId,
        },
      });
      return evaluation;
    },

    async findByPostIdPaginated({
      postId,
      limit,
      offset,
    }): Promise<PostEvaluation[]> {
      const post = await postsEvaluationsRepository.find({
        where: {
          postId,
        },
        take: limit,
        skip: offset,
        order: {
          createdAt: 'DESC',
        },
      });
      return post;
    },

    async create(
      evaluationData: ICreatePostsEvaluationDTO,
    ): Promise<PostEvaluation> {
      const evaluation = postsEvaluationsRepository.create(evaluationData);

      await postsEvaluationsRepository.save(evaluation);

      return evaluation;
    },

    async save(evaluation: PostEvaluation): Promise<PostEvaluation> {
      return postsEvaluationsRepository.save(evaluation);
    },

    async all(): Promise<PostEvaluation[]> {
      return postsEvaluationsRepository.find();
    },

    async delete(evaluationId: string): Promise<void> {
      postsEvaluationsRepository.delete(evaluationId);
    },
  });
