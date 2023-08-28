import { instanceToInstance } from 'class-transformer';

import { container } from 'tsyringe';
import { z } from 'zod';
import { Request, Response } from 'express';
import { CreatePostService } from '../services/posts/CreatePostService';
import { DeletePostService } from '../services/posts/DeletePostService';
import { ShowPostsService } from '../services/posts/ShowPostsService';
import { ShowPostsByUserIdService } from '../services/posts/ShowPostsByUserIdService';

const createPostSchema = z.object({
  userId: z.string().uuid(),
  photoId: z.string(),
  description: z.string().max(1000),
  filterUsed: z.string(),
});

const deletePostSchema = z.object({
  userId: z.string().uuid(),
  postId: z.string(),
});

const showPostSchema = z.object({
  userId: z.string().uuid(),
  limit: z.number().int().nonnegative().default(10),
  offset: z.number().int().nonnegative().default(0),
});

const showPostByUserSchema = z.object({
  userId: z.string().uuid(),
  limit: z.number().int().nonnegative().default(10),
  offset: z.number().int().nonnegative().default(0),
});

export class PostsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { userId, photoId, description, filterUsed } = createPostSchema.parse(
      {
        userId: request.user.id,
        photoId: request.body.photoId,
        description: request.body.description,
        filterUsed: request.body.filterUsed,
      },
    );

    const createPostService = container.resolve(CreatePostService);

    const post = await createPostService.execute({
      userId,
      photoId,
      description,
      filterUsed,
    });

    return response.json(instanceToInstance(post));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { userId, limit, offset } = showPostSchema.parse({
      userId: request.user.id,
      limit: Number(request.query.limit),
      offset: Number(request.query.offset),
    });

    const showPostsService = container.resolve(ShowPostsService);

    const posts = await showPostsService.execute({ userId, limit, offset });

    return response.json(instanceToInstance(posts));
  }

  public async showPostsByUserId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { userId, limit, offset } = showPostByUserSchema.parse({
      userId: request.params.userId,
      limit: Number(request.query.limit),
      offset: Number(request.query.offset),
    });

    const showPostsByUserIdService = container.resolve(
      ShowPostsByUserIdService,
    );

    const posts = await showPostsByUserIdService.execute({
      userId,
      limit,
      offset,
    });

    return response.json(instanceToInstance(posts));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { userId, postId } = deletePostSchema.parse({
      userId: request.user.id,
      postId: request.query.postId,
    });

    const deletePostService = container.resolve(DeletePostService);

    const post = await deletePostService.execute({
      userId,
      postId,
    });

    return response.json(instanceToInstance(post));
  }
}
