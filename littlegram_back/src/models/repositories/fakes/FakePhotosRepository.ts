import { v4 } from 'uuid';
import { Photo } from '@models/entities/Photo';

import { ICreatePhotoDTO } from '@models/dtos/ICreatePhotoDTO';
import { IShowByUserPaginatedDTO } from '@models/dtos/IShowByUserPaginatedDTO';
import { IPhotosRepository } from '../interfaces/IPhotosRepository';

export class FakePhotosRepository implements IPhotosRepository {
  private photos: Photo[] = [];

  public async all(): Promise<Photo[]> {
    return this.photos;
  }

  public async findById(id: string): Promise<Photo | null> {
    const findPhoto = this.photos.find(photo => photo.id === id);

    return findPhoto || null;
  }

  public async findByUserId(userId: string): Promise<Photo[]> {
    const findPhotos = this.photos.filter(photo => photo.userId === userId);

    return findPhotos || null;
  }

  public async findByPath(path: string): Promise<Photo | null> {
    const findPhoto = this.photos.find(photo => photo.path === path);

    return findPhoto || null;
  }

  public async findByUserIdPaginated(
    data: IShowByUserPaginatedDTO,
  ): Promise<Photo[]> {
    const findPhotos = this.photos.filter(
      photo => photo.userId === data.userId,
    );

    const skip = data.offset * data.limit;
    const take = data.limit;

    const photos = findPhotos.slice(skip, skip + take);

    return photos || null;
  }

  public async create(data: ICreatePhotoDTO): Promise<Photo> {
    const photo = new Photo();

    Object.assign(photo, { id: v4() }, data);

    this.photos.push(photo);

    return photo;
  }

  public async save(photo: Photo): Promise<Photo> {
    const findIndex = this.photos.findIndex(
      findPhoto => findPhoto.id === photo.id,
    );

    this.photos[findIndex] = photo;

    return photo;
  }

  public async delete(photoId: string): Promise<void> {
    this.photos = this.photos.filter(photo => photo.id !== photoId);
  }
}
