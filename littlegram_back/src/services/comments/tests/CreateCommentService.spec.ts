import { FakeUsersRepository } from '@models/repositories/fakes/FakeUsersRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';
import { FakeCommentsRepository } from '@models/repositories/fakes/FakeCommentsRepository';

import { AppError } from '@shared/errors/AppError';

import { CreateCommentService } from '../CreateCommentService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let fakeCommentsRepository: FakeCommentsRepository;

let createCommentService: CreateCommentService;

describe('CreateCommentService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    fakeCommentsRepository = new FakeCommentsRepository();

    createCommentService = new CreateCommentService(
      fakeUsersRepository,
      fakePostsRepository,
      fakeCommentsRepository,
    );
  });

  it('should be able to create a comment', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const post = await fakePostsRepository.create({
      userId: user.id,
      photoId: 'photo-id',
      description: 'Description Test',
      filterUsed: 'none',
    });

    const comment = await createCommentService.execute({
      text: 'This is a test comment',
      userId: user.id,
      postId: post.id,
    });

    expect(comment).toHaveProperty('id');
    expect(comment.userId).toBe(user.id);
    expect(comment.postId).toBe(post.id);
  });

  it('should not be able to create a comment with a non-existing user', async () => {
    const post = await fakePostsRepository.create({
      userId: 'non-existing-user',
      photoId: 'photo-id',
      description: 'Description Test',
      filterUsed: 'none',
    });

    expect(
      createCommentService.execute({
        text: 'This is a test comment',
        userId: 'non-existing-user',
        postId: post.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a comment with a non-existing post', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    expect(
      createCommentService.execute({
        text: 'This is a test comment',
        userId: user.id,
        postId: 'non-existing-post',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
