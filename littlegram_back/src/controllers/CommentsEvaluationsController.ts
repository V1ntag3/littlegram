import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import { z } from 'zod';
import { Request, Response } from 'express';
import { CreateCommentEvaluationService } from '../services/commentsEvaluations/CreateCommentsEvaluationService';
import { ShowCommentsEvaluationsService } from '../services/commentsEvaluations/ShowCommentsEvaluationsService';
import { ShowCommentsEvaluationsByCommentService } from '../services/commentsEvaluations/ShowCommentsEvaluationsByCommentService';

const createCommentEvaluationSchema = z.object({
  isLike: z.boolean(),
  userId: z.string().uuid(),
  commentId: z.string().uuid(),
});

const showCommentsEvaluationsByCommentCommentSchema = z.object({
  commentId: z.string().uuid(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
});

export class CommentsEvaluationsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { isLike, userId, commentId } = createCommentEvaluationSchema.parse({
      userId: request.user.id,
      isLike: request.body.isLike,
      commentId: request.body.commentId,
    });

    const createCommentEvaluationService = container.resolve(
      CreateCommentEvaluationService,
    );

    const commentEvaluation = await createCommentEvaluationService.execute({
      isLike,
      userId,
      commentId,
    });

    return response.json(instanceToInstance(commentEvaluation));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const showCommentsEvaluationsService = container.resolve(
      ShowCommentsEvaluationsService,
    );

    const commentsEvaluations = await showCommentsEvaluationsService.execute();

    return response.json(commentsEvaluations);
  }

  public async showByComment(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { commentId, limit, offset } =
      showCommentsEvaluationsByCommentCommentSchema.parse({
        commentId: request.params.commentId,
        limit: Number(request.query.limit),
        offset: Number(request.query.offset),
      });

    const showCommentsEvaluationsByCommentService = container.resolve(
      ShowCommentsEvaluationsByCommentService,
    );

    const commentsEvaluations =
      await showCommentsEvaluationsByCommentService.execute({
        limit,
        offset,
        commentId,
      });

    return response.json(commentsEvaluations);
  }
}
