import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { z } from 'zod';

import { ShowPostsEvaluationsByPostService } from '../services/postsEvaluations/ShowPostsEvaluationsByPostService';
import { ShowPostsEvaluationsService } from '../services/postsEvaluations/ShowPostsEvaluationsService';
import { CreatePostEvaluationService } from '../services/postsEvaluations/CreatePostEvaluationService';

const createPostEvaluationSchema = z.object({
  isLike: z.boolean(),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
});

const showPostsEvaluationsByCommentCommentSchema = z.object({
  postId: z.string().uuid(),
  limit: z.number().int().nonnegative().default(10),
  offset: z.number().int().nonnegative().default(0),
});

export class PostsEvaluationsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { isLike, userId, postId } = createPostEvaluationSchema.parse({
      userId: request.user.id,
      isLike: request.body.isLike,
      postId: request.body.postId,
    });

    const createPostEvaluationService = container.resolve(
      CreatePostEvaluationService,
    );

    const commentEvaluation = await createPostEvaluationService.execute({
      isLike,
      userId,
      postId,
    });

    return response.json(instanceToInstance(commentEvaluation));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const showPostsEvaluationsService = container.resolve(
      ShowPostsEvaluationsService,
    );

    const commentsEvaluations = await showPostsEvaluationsService.execute();

    return response.json(commentsEvaluations);
  }

  public async showByPost(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { postId, limit, offset } =
      showPostsEvaluationsByCommentCommentSchema.parse({
        postId: request.params.postId,
        limit: Number(request.query.limit),
        offset: Number(request.query.offset),
      });

    const showPostsEvaluationsByPostService = container.resolve(
      ShowPostsEvaluationsByPostService,
    );

    const commentsEvaluations = await showPostsEvaluationsByPostService.execute(
      { limit, offset, postId },
    );

    return response.json(commentsEvaluations);
  }
}
