import { FakeUsersRepository } from '@models/repositories/fakes/FakeUsersRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';
import { FakeCommentsRepository } from '@models/repositories/fakes/FakeCommentsRepository';

import { AppError } from '@shared/errors/AppError';

import { FakePostsEvaluationRepository } from '@models/repositories/fakes/FakePostsEvaluationsRepository';
import { CreatePostEvaluationService } from '../CreatePostEvaluationService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let fakePostsEvaluationsRepository: FakePostsEvaluationRepository;

let createPostEvaluationService: CreatePostEvaluationService;

describe('CreatePostEvaluationService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    fakeCommentsRepository = new FakeCommentsRepository();
    fakePostsEvaluationsRepository = new FakePostsEvaluationRepository();

    createPostEvaluationService = new CreatePostEvaluationService(
      fakeUsersRepository,
      fakePostsRepository,
      fakePostsEvaluationsRepository,
    );
  });

  it('should be able to create a post evaluation', async () => {
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

    const comment = await fakeCommentsRepository.create({
      text: 'This is a test comment',
      userId: user.id,
      postId: post.id,
    });

    const postEvaluation = await createPostEvaluationService.execute({
      userId: user.id,
      postId: post.id,
      isLike: true,
    });

    expect(comment).toHaveProperty('id');
    expect(comment.userId).toBe(user.id);
    expect(comment.postId).toBe(post.id);
    expect(postEvaluation).toHaveProperty('id');
  });

  it('should not be able to create a post evaluation with a non-existing user', async () => {
    expect(
      createPostEvaluationService.execute({
        userId: 'non-existing-user',
        postId: 'post-id',
        isLike: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a post evaluation with a non-existing comment', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    expect(
      createPostEvaluationService.execute({
        userId: user.id,
        postId: 'post-id',
        isLike: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a post evaluation in a comment that him already evaluate', async () => {
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

    await fakeCommentsRepository.create({
      text: 'This is a test comment',
      userId: user.id,
      postId: post.id,
    });

    await createPostEvaluationService.execute({
      userId: user.id,
      postId: post.id,
      isLike: true,
    });

    expect(
      createPostEvaluationService.execute({
        userId: user.id,
        postId: post.id,
        isLike: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
