import { inject, injectable } from 'tsyringe';

import { Photo } from '@models/entities/Photo';

import { IPhotosRepository } from '@models/repositories/interfaces/IPhotosRepository';
import { IStorageProvider } from '@shared/container/providers/DiskStorageProvider/models/IStorageProvider';
import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

import { AppError } from '@shared/errors/AppError';

interface Request {
  userId: string;

  photoId: string;

  path: string;
}

@injectable()
export class DeletePhotoService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PhotosRepository')
    private photosRepository: IPhotosRepository,

    @inject('DiskStorageProvider')
    private diskStorageProvider: IStorageProvider,
  ) {}

  public async execute({ photoId, userId, path }: Request): Promise<Photo> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const photo = await this.photosRepository.findById(photoId);
    if (!photo) {
      throw new AppError('Photo not found');
    }

    await this.diskStorageProvider.deletePhotoFile(path);
    await this.photosRepository.delete(photo.id);

    return photo;
  }
}
