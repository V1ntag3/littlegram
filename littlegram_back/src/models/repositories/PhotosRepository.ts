import { connectionSource } from '@models/database/dataSource';

import { Photo } from '@models/entities/Photo';

import { ICreatePhotoDTO } from '@models/dtos/ICreatePhotoDTO';
import { IPhotosRepository } from './interfaces/IPhotosRepository';

const photosRepository = connectionSource.getRepository(Photo);

export const PhotosRepository: IPhotosRepository = photosRepository.extend({
  async findById(id: string): Promise<Photo | null> {
    const photo = await photosRepository.findOne({
      where: {
        id,
      },
    });
    return photo;
  },

  async findByPath(path: string): Promise<Photo | null> {
    const photo = await photosRepository.findOne({
      where: {
        path,
      },
    });
    return photo;
  },

  async findByUserId(userId: string): Promise<Photo[]> {
    const photo = await photosRepository.find({
      where: {
        userId,
      },
    });
    return photo;
  },

  async findByUserIdPaginated({
    userId,
    limit,
    offset,
  }: {
    userId: string;
    limit: number;
    offset: number;
  }): Promise<Photo[]> {
    const photos = await photosRepository.find({
      where: {
        userId,
      },
      take: limit,
      skip: offset,
    });
    return photos;
  },

  async create(photoData: ICreatePhotoDTO): Promise<Photo> {
    const photo = photosRepository.create(photoData);

    await photosRepository.save(photo);

    return photo;
  },

  async save(photo: Photo): Promise<Photo> {
    return photosRepository.save(photo);
  },

  async all(): Promise<Photo[]> {
    return photosRepository.find();
  },

  async delete(photoId: string): Promise<void> {
    photosRepository.delete(photoId);
  },
});
