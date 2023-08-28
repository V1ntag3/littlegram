import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';
import { IPhotosRepository } from '@models/repositories/interfaces/IPhotosRepository';

import { Photo } from '@models/entities/Photo';

import { AppError } from '@shared/errors/AppError';

interface Request {
  userId: string;

  limit: number;

  offset: number;
}

interface Response {
  photos: Photo[];

  totalPhotos: number;

  totalPages: number;

  offset: number;
}

@injectable()
export class ShowPhotoService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PhotosRepository')
    private photosRepository: IPhotosRepository,
  ) {}

  public async execute({ userId, offset, limit }: Request): Promise<Response> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const allPhotos = await this.photosRepository.findByUserId(userId);

    const totalPhotos = allPhotos.length;
    const totalPages = Math.ceil(totalPhotos / limit);

    const realOffset = offset * limit;

    const photos = await this.photosRepository.findByUserIdPaginated({
      userId,
      limit,
      offset: realOffset,
    });

    const response = {
      photos,
      totalPhotos,
      totalPages,
      offset,
    } as Response;

    return response;
  }
}
