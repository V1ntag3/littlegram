import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { CreateMultiplePhotosService } from 'services/photos/CreateMultiplePhotosService';

import { container } from 'tsyringe';
import { z } from 'zod';

import { CreatePhotoService } from '../services/photos/CreatePhotoService';
import { DeletePhotoService } from '../services/photos/DeletePhotoService';
import { ShowPhotoService } from '../services/photos/ShowPhotoService';

const createPhotoSchema = z.object({
  userId: z.string().uuid(),
  path: z.string(),
});

const createPhotosSchema = z.object({
  userId: z.string().uuid(),
  photos: z.array(
    z.object({
      path: z.string(),
      size: z.number(),
    }),
  ),
});

const deletePhotoSchema = z.object({
  userId: z.string().uuid(),
  path: z.string(),
  photoId: z.string().uuid(),
});

export class PhotosController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { userId, path } = createPhotoSchema.parse({
      userId: request.user.id,
      path: request.file?.filename,
    });

    const byteImageSize = request.file?.size;
    const createPhotoService = container.resolve(CreatePhotoService);

    const photo = await createPhotoService.execute({
      userId,
      path,
      byteImageSize,
    });

    return response.json(instanceToInstance(photo));
  }

  public async createMultiple(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const requestFiles = request.files as Express.Multer.File[];
    const { userId, photos } = createPhotosSchema.parse({
      userId: request.user.id,
      photos: requestFiles.map(file => ({
        path: file.filename,
        size: file.size,
      })),
    });

    const createMultiplePhotosService = container.resolve(
      CreateMultiplePhotosService,
    );
    const newPhotos = await createMultiplePhotosService.execute({
      userId,
      photos,
    });

    return response.json(instanceToInstance(newPhotos));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const showPhotoService = container.resolve(ShowPhotoService);

    const photos = await showPhotoService.execute(userId);

    return response.json(photos);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { userId, photoId, path } = deletePhotoSchema.parse({
      userId: request.user.id,
      path: request.query.path,
      photoId: request.query.photoId,
    });

    const deletePhotoService = container.resolve(DeletePhotoService);

    const photo = await deletePhotoService.execute({
      userId,
      photoId,
      path,
    });

    return response.json(instanceToInstance(photo));
  }
}
