import { uploadConfig } from '@config/upload';

import { FakePhotosRepository } from '@models/repositories/fakes/FakePhotosRepository';
import { FakeStorageProvider } from '@shared/container/providers/DiskStorageProvider/fakes/FakeStorageProvider';

import { AppError } from '@shared/errors/AppError';

import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';
import { CreateMultiplePhotosService } from '../CreateMultiplePhotosService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakePhotosRepository: FakePhotosRepository;
let createMultiplePhotoService: CreateMultiplePhotosService;

describe('CreatePhotoService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakePhotosRepository = new FakePhotosRepository();

    createMultiplePhotoService = new CreateMultiplePhotosService(
      fakeUsersRepository,
      fakePhotosRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to upload multiple photos', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await createMultiplePhotoService.execute({
      userId: user.id,
      photos: [
        {
          path: 'photo.jpg',
          size: 100,
        },
        {
          path: 'photo2.jpg',
          size: 100,
        },
      ],
    });

    const userPhotos = await fakePhotosRepository.findByUserId(user.id);

    const photoUploadedRecently = userPhotos?.find(photo => {
      return photo.path === 'photo.jpg';
    });

    expect(userPhotos).toHaveLength(2);
    expect(photoUploadedRecently?.path).toBe('photo.jpg');
  });

  it('should NOT be able to upload a photo to a non existing user', async () => {
    await expect(
      createMultiplePhotoService.execute({
        userId: 'non-existing-user',
        photos: [
          {
            path: 'photo.jpg',
            size: 100,
          },
        ],
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
      createMultiplePhotoService.execute({
        userId: user.id,
        photos: [
          {
            path: 'photo.jpg',
            size: uploadConfig.bytesSizeLimit + 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to upload when does not have a image', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await expect(
      createMultiplePhotoService.execute({
        userId: user.id,
        photos: null,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to upload when it is not possible to get the photo size', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await expect(
      createMultiplePhotoService.execute({
        userId: user.id,
        photos: [
          {
            path: 'photo.jpg',
            size: null,
          },
          {
            path: 'photo2.jpg',
            size: null,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
