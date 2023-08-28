import { inject, injectable } from 'tsyringe';

import { Photo } from '@models/entities/Photo';

import { uploadConfig } from '@config/upload';

import { IPhotosRepository } from '@models/repositories/interfaces/IPhotosRepository';
import { IStorageProvider } from '@shared/container/providers/DiskStorageProvider/models/IStorageProvider';
import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

import { AppError } from '@shared/errors/AppError';

interface RequestPhoto {
  path: string;
  size: number | null;
}

interface Request {
  userId: string;

  photos: RequestPhoto[] | null;
}

@injectable()
export class CreateMultiplePhotosService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PhotosRepository')
    private photosRepository: IPhotosRepository,

    @inject('DiskStorageProvider')
    private diskStorageProvider: IStorageProvider,
  ) {}

  public async execute({ userId, photos }: Request): Promise<Photo[]> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    if (!photos) {
      throw new AppError('Photos not found');
    }

    const newPhotosPromise = photos.map(async photo => {
      if (!photo.size) {
        await this.diskStorageProvider.deleteTmpFile(photo.path);
        throw new AppError('Image not found');
      }

      if (photo.size > uploadConfig.bytesSizeLimit) {
        await this.diskStorageProvider.deleteTmpFile(photo.path);
        throw new AppError('Image size is too large');
      }

      const filename = await this.diskStorageProvider.savePhotoFile(photo.path);

      const newPhoto = await this.photosRepository.create({
        userId,
        path: filename,
        size: photo.size,
      });

      return newPhoto;
    });

    const newPhotos = await Promise.all(newPhotosPromise);

    return newPhotos;
  }
}
