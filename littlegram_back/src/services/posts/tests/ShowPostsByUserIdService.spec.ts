import { FakePhotosRepository } from '@models/repositories/fakes/FakePhotosRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';
import { FakeStorageProvider } from '@shared/container/providers/DiskStorageProvider/fakes/FakeStorageProvider';

import { AppError } from '@shared/errors/AppError';
import { CreatePhotoService } from '../../photos/CreatePhotoService';

import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';
import { ShowPostsByUserIdService } from '../ShowPostsByUserIdService';
import { CreatePostService } from '../CreatePostService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakePhotosRepository: FakePhotosRepository;
let fakePostsRepository: FakePostsRepository;

let createPhotoService: CreatePhotoService;
let createPostService: CreatePostService;
let showPostsByUserIdService: ShowPostsByUserIdService;

describe('ShowPostByUserIdService', () => {
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
    showPostsByUserIdService = new ShowPostsByUserIdService(
      fakePostsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to show all user posts', async () => {
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

    const photos = await fakePhotosRepository.findByUserId(user.id);

    if (!photos) {
      throw new AppError('Photos not found');
    }

    await createPostService.execute({
      userId: user.id,
      photoId: photos[0].id,
      description: 'Description Test',
      filterUsed: 'none',
    });

    await createPostService.execute({
      userId: user.id,
      photoId: photos[0].id,
      description: 'Description Test 2',
      filterUsed: 'none',
    });

    const userPosts = await showPostsByUserIdService.execute({
      userId: user.id,
      limit: 10,
      offset: 0,
    });

    expect(userPosts.posts).toHaveLength(2);
  });

  it('should be able to return 0 posts', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const limit = 10;
    const offset = 0;

    const userPosts = await showPostsByUserIdService.execute({
      userId: user.id,
      limit,
      offset,
    });

    expect(userPosts.posts).toHaveLength(0);
  });

  it('should be able to return 0 posts from a offset too big', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const limit = 10;
    const offset = 2;

    await fakePostsRepository.create({
      userId: user.id,
      photoId: 'photoId',
      description: 'Description Test',
      filterUsed: 'none',
    });

    const userPosts = await showPostsByUserIdService.execute({
      userId: user.id,
      limit,
      offset,
    });

    expect(userPosts.posts).toHaveLength(0);
  });

  it('should NOT be able to show a post from a non existing user', async () => {
    await expect(
      showPostsByUserIdService.execute({
        userId: 'non-existing-user',
        limit: 10,
        offset: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
