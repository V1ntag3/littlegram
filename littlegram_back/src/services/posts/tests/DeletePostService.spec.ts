import { FakePhotosRepository } from '@models/repositories/fakes/FakePhotosRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';
import { FakeStorageProvider } from '@shared/container/providers/DiskStorageProvider/fakes/FakeStorageProvider';

import { AppError } from '@shared/errors/AppError';
import { CreatePhotoService } from '../../photos/CreatePhotoService';

import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';
import { CreatePostService } from '../CreatePostService';
import { DeletePostService } from '../DeletePostService';

let fakeUsersRepository: FakeUsersRepository;
let fakePhotosRepository: FakePhotosRepository;
let fakePostsRepository: FakePostsRepository;

let fakeStorageProvider: FakeStorageProvider;

let createPhotoService: CreatePhotoService;

let createPostService: CreatePostService;
let deletePostService: DeletePostService;

describe('DeletePostService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakePhotosRepository = new FakePhotosRepository();
    fakePostsRepository = new FakePostsRepository();

    createPhotoService = new CreatePhotoService(
      fakeUsersRepository,
      fakePhotosRepository,
      fakeStorageProvider,
    );

    createPostService = new CreatePostService(
      fakeUsersRepository,
      fakePhotosRepository,
      fakePostsRepository,
    );

    deletePostService = new DeletePostService(
      fakeUsersRepository,
      fakePostsRepository,
    );
  });

  it('should be able to delete a post', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const photo = await createPhotoService.execute({
      userId: user.id,
      path: 'photo.jpg',
      byteImageSize: 100,
    });

    const post = await createPostService.execute({
      userId: user.id,
      photoId: photo.id,
      description: 'Description Test',
      filterUsed: 'none',
    });

    await deletePostService.execute({
      userId: user.id,
      postId: post.id,
    });

    const userPosts = await fakePostsRepository.findByUserId(user.id);

    expect(userPosts).toHaveLength(0);
  });

  it('should NOT be able to delete a post if user does not exist', async () => {
    await expect(
      deletePostService.execute({
        userId: 'non-existing-user-id',
        postId: 'photo-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to delete a post if post does not exist', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await expect(
      deletePostService.execute({
        userId: user.id,
        postId: 'non-existing-post-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a post that is from other user', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const otherUser = await fakeUsersRepository.create({
      realName: 'Other User',
      username: 'otherUser',
      email: 'otheruser@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const photoFromOtherUser = await createPhotoService.execute({
      userId: otherUser.id,
      path: 'photoFromOtherUser.jpg',
      byteImageSize: 100,
    });

    const post = await createPostService.execute({
      userId: otherUser.id,
      photoId: photoFromOtherUser.id,
      description: 'Description Test',
      filterUsed: 'none',
    });

    await expect(
      deletePostService.execute({
        userId: user.id,
        postId: post.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
