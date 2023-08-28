import { uploadConfig } from '@config/upload';

import { FakePhotosRepository } from '@models/repositories/fakes/FakePhotosRepository';
import { FakeStorageProvider } from '@shared/container/providers/DiskStorageProvider/fakes/FakeStorageProvider';

import { AppError } from '@shared/errors/AppError';

import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';
import { CreatePhotoService } from '../CreatePhotoService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakePhotosRepository: FakePhotosRepository;
let createPhotoService: CreatePhotoService;

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
  });

  it('should be able to upload a photo', async () => {
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

    const userPhotos = await fakePhotosRepository.findByUserId(user.id);

    const photoUploadedRecently = userPhotos?.find(photo => {
      return photo.path === 'photo.jpg';
    });

    expect(userPhotos).toHaveLength(1);
    expect(photoUploadedRecently?.path).toBe('photo.jpg');
  });

  it('should NOT be able to upload a photo to a non existing user', async () => {
    await expect(
      createPhotoService.execute({
        userId: 'non-existing-user',
        path: 'photo.jpg',
        byteImageSize: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to upload a photo bigger then 10MB', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await expect(
      createPhotoService.execute({
        userId: user.id,
        path: 'photo.jpg',
        byteImageSize: uploadConfig.bytesSizeLimit + 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to upload when it is not possible to get the file size', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await expect(
      createPhotoService.execute({
        userId: user.id,
        path: 'photo.jpg',
        byteImageSize: undefined,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
