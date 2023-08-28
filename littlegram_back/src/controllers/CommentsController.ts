import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import { z } from 'zod';
import { Request, Response } from 'express';
import { CreateCommentService } from '../services/comments/CreateCommentService';
import { DeleteCommentService } from '../services/comments/DeleteCommentService';
import { ShowCommentsService } from '../services/comments/ShowCommentsService';
import { DeleteCommentsByPostService } from '../services/comments/DeleteCommentsByPostService';

const createCommentSchema = z.object({
  text: z.string().min(1).max(100),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
});

const deleteCommentSchema = z.object({
  userId: z.string().uuid(),
  commentId: z.string().uuid(),
  postId: z.string().uuid(),
});

const deleteCommentByPostSchema = z.object({
  userId: z.string().uuid(),
  postId: z.string().uuid(),
});

const showCommentsSchema = z.object({
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  limit: z.number().int().nonnegative().default(10),
  offset: z.number().int().nonnegative().default(0),
});

export class CommentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { text, userId, postId } = createCommentSchema.parse({
      text: request.body.text,
      userId: request.user.id,
      postId: request.body.postId,
    });

    const createCommentService = container.resolve(CreateCommentService);

    const comment = await createCommentService.execute({
      text,
      userId,
      postId,
    });

    return response.json(instanceToInstance(comment));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { userId, postId, limit, offset } = showCommentsSchema.parse({
      userId: request.user.id,
      postId: request.params.postId,
      limit: Number(request.query.limit),
      offset: Number(request.query.offset),
    });

    const showCommentsService = container.resolve(ShowCommentsService);

    const comments = await showCommentsService.execute({
      userId,
      postId,
      limit: Number(limit),
      offset: Number(offset),
    });

    return response.json(instanceToInstance(comments));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { userId, commentId, postId } = deleteCommentSchema.parse({
      userId: request.user.id,
      commentId: request.query.commentId,
      postId: request.query.postId,
    });

    const deleteCommentService = container.resolve(DeleteCommentService);

    const comment = await deleteCommentService.execute({
      userId,
      commentId,
      postId,
    });

    return response.json(instanceToInstance(comment));
  }

  public async deleteByPost(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { userId, postId } = deleteCommentByPostSchema.parse({
      userId: request.user.id,
      postId: request.query.postId,
    });

    const deleteCommentsByPostService = container.resolve(
      DeleteCommentsByPostService,
    );

    const comments = await deleteCommentsByPostService.execute({
      userId,
      postId,
    });

    return response.json(instanceToInstance(comments));
  }
}
