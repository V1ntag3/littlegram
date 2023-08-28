import { FakeCommentsRepository } from '@models/repositories/fakes/FakeCommentsRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';

import { AppError } from '@shared/errors/AppError';

import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';
import { DeleteCommentsByPostService } from '../DeleteCommentsByPostService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostRepository: FakePostsRepository;
let fakeCommentsRepository: FakeCommentsRepository;

let deleteCommentsByPostService: DeleteCommentsByPostService;

describe('DeleteCommentService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostRepository = new FakePostsRepository();
    fakeCommentsRepository = new FakeCommentsRepository();

    deleteCommentsByPostService = new DeleteCommentsByPostService(
      fakeUsersRepository,
      fakePostRepository,
      fakeCommentsRepository,
    );
  });

  it('should be able to delete a comment', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const post = await fakePostRepository.create({
      userId: user.id,
      photoId: 'test',
      description: 'test',
      filterUsed: 'test',
    });

    await fakeCommentsRepository.create({
      userId: user.id,
      postId: post.id,
      text: 'test',
    });

    await deleteCommentsByPostService.execute({
      userId: user.id,
      postId: post.id,
    });

    const userPhotos = await fakeCommentsRepository.findByUserId(user.id);

    expect(userPhotos).toHaveLength(0);
  });

  it('should NOT be able to delete a comment if user does not exist', async () => {
    const comment = await fakeCommentsRepository.create({
      userId: 'non-existing-user-id',
      postId: 'test',
      text: 'test',
    });

    await expect(
      deleteCommentsByPostService.execute({
        userId: 'non-existing-user-id',
        postId: comment.postId,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to delete a comment if post does not exist', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await expect(
      deleteCommentsByPostService.execute({
        userId: user.id,
        postId: 'non-existing-post-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to delete a comment if user is not the post owner', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const anotherUser = await fakeUsersRepository.create({
      realName: 'test2',
      username: 'testUser2',
      email: 'teste2@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const post = await fakePostRepository.create({
      userId: user.id,
      photoId: 'test',
      description: 'test',
      filterUsed: 'test',
    });

    await fakeCommentsRepository.create({
      userId: user.id,
      postId: post.id,
      text: 'test',
    });

    await expect(
      deleteCommentsByPostService.execute({
        userId: anotherUser.id,
        postId: post.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
