import { FakeUsersRepository } from '@models/repositories/fakes/FakeUsersRepository';
import { FakePhotosRepository } from '@models/repositories/fakes/FakePhotosRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';

import { AppError } from '@shared/errors/AppError';

import { FakeStorageProvider } from '@shared/container/providers/DiskStorageProvider/fakes/FakeStorageProvider';
import { CreatePhotoService } from '../../photos/CreatePhotoService';
import { CreatePostService } from '../CreatePostService';

let fakeUsersRepository: FakeUsersRepository;
let fakePhotosRepository: FakePhotosRepository;
let fakePostsRepository: FakePostsRepository;

let fakeStorageProvider: FakeStorageProvider;

let createPost: CreatePostService;
let createPhotoService: CreatePhotoService;

describe('CreatePostService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePhotosRepository = new FakePhotosRepository();
    fakePostsRepository = new FakePostsRepository();

    fakeStorageProvider = new FakeStorageProvider();

    createPost = new CreatePostService(
      fakeUsersRepository,
      fakePhotosRepository,
      fakePostsRepository,
    );

    createPhotoService = new CreatePhotoService(
      fakeUsersRepository,
      fakePhotosRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create a post', async () => {
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

    const post = await createPost.execute({
      userId: user.id,
      photoId: photo.id,
      description: 'Description Test',
      filterUsed: 'none',
    });

    expect(post).toHaveProperty('id');
    expect(post.userId).toBe(user.id);
    expect(post.photoId).toBe(photo.id);
  });

  it('should not be able to create a post with a non existing user', async () => {
    expect(
      createPost.execute({
        userId: 'non-existing-user',
        photoId: 'photo-id',
        description: 'Description Test',
        filterUsed: 'none',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a post with a non existing photo', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    expect(
      createPost.execute({
        userId: user.id,
        photoId: 'photo-id',
        description: 'Description Test',
        filterUsed: 'none',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a post with a photo that is from other user', async () => {
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

    expect(
      createPost.execute({
        userId: user.id,
        photoId: photoFromOtherUser.id,
        description: 'Description Test',
        filterUsed: 'none',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a post with a description bigger then 1000 characters', async () => {
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

    expect(
      createPost.execute({
        userId: user.id,
        photoId: photo.id,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in porttitor nibh, nec hendrerit massa. Integer sed maximus metus, vitae aliquam elit. Cras id convallis dui. Phasellus sit amet vehicula lacus. Suspendisse metus ante, elementum quis luctus nec, vehicula dictum mauris. Proin sit amet magna pretium diam aliquam bibendum. Praesent at neque nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam pretium risus nulla, non malesuada lectus varius a. In eget dolor in elit lobortis laoreet. Vivamus molestie, sapien nec tincidunt dapibus, neque enim efficitur ante, in vehicula quam nunc vitae ligula.Ut vitae fringilla orci. Mauris feugiat magna a dui auctor, sit amet tincidunt turpis lacinia. Integer eget sem pellentesque, malesuada felis sed, placerat ipsum. Proin vestibulum consequat purus, quis ultrices risus iaculis nec. Fusce iaculis semper nisl eget pellentesque. Praesent tincidunt, elit ut feugiat facilisis, metus purus euismod est, ut sagittis risus neque non purus. Suspendisse eu ullamcorper augue. In hac habitasse platea dictumst. Fusce quis nibh tellus. In volutpat malesuada dolor, nec accumsan nunc sollicitudin et. Integer in fringilla odio. Donec id congue magna, nec cursus libero. Nam fermentum ligula et pharetra interdum. Cras pharetra eleifend enim ac porttitor. Duis semper ultrices risus, eget convallis urna lobortis ut.        ',
        filterUsed: 'none',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
