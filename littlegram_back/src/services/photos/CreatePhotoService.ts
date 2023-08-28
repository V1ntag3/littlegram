import { inject, injectable } from 'tsyringe';

import { Photo } from '@models/entities/Photo';

import { uploadConfig } from '@config/upload';

import { IPhotosRepository } from '@models/repositories/interfaces/IPhotosRepository';
import { IStorageProvider } from '@shared/container/providers/DiskStorageProvider/models/IStorageProvider';
import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

import { AppError } from '@shared/errors/AppError';

interface Request {
  userId: string;

  path: string;

  byteImageSize: number | undefined;
}

@injectable()
export class CreatePhotoService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PhotosRepository')
    private photosRepository: IPhotosRepository,

    @inject('DiskStorageProvider')
    private diskStorageProvider: IStorageProvider,
  ) {}

  public async execute({
    path,
    userId,
    byteImageSize,
  }: Request): Promise<Photo> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    if (!byteImageSize) {
      await this.diskStorageProvider.deleteTmpFile(path);
      throw new AppError('Image not found');
    }

    if (byteImageSize > uploadConfig.bytesSizeLimit) {
      await this.diskStorageProvider.deleteTmpFile(path);
      throw new AppError('Image size is too large');
    }

    const filename = await this.diskStorageProvider.savePhotoFile(path);

    const newPhoto = await this.photosRepository.create({
      userId,
      path: filename,
      size: byteImageSize,
    });

    return newPhoto;
  }
}
