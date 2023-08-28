import { FakePhotosRepository } from '@models/repositories/fakes/FakePhotosRepository';
import { FakeStorageProvider } from '@shared/container/providers/DiskStorageProvider/fakes/FakeStorageProvider';

import { AppError } from '@shared/errors/AppError';

import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';
import { CreatePhotoService } from '../CreatePhotoService';
import { ShowPhotoService } from '../ShowPhotoService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakePhotosRepository: FakePhotosRepository;

let createPhotoService: CreatePhotoService;
let showPhotoService: ShowPhotoService;

describe('CreatePhotoService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakePhotosRepository = new FakePhotosRepository();

    createPhotoService = new CreatePhotoService(
      fakeUsersRepository,
      fakePhotosRepository,
      fakeStorageProvider,
    );
    showPhotoService = new ShowPhotoService(
      fakeUsersRepository,
      fakePhotosRepository,
    );
  });

  it('should be able to show all user photos', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await createPhotoService.execute({
      userId: user.id,
      path: 'photo.jpg',
      byteImageSize: 100,
    });

    const userPhotos = await showPhotoService.execute({
      userId: user.id,
      limit: 10,
      offset: 0,
    });

    expect(userPhotos.photos).toHaveLength(1);
  });

  it('should NOT be able to show a photo from a non existing user', async () => {
    await expect(
      showPhotoService.execute({
        userId: 'non-existing-user',
        limit: 10,
        offset: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
