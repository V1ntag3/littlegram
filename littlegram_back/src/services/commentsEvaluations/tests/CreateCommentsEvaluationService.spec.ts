import { FakeUsersRepository } from '@models/repositories/fakes/FakeUsersRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';
import { FakeCommentsRepository } from '@models/repositories/fakes/FakeCommentsRepository';

import { AppError } from '@shared/errors/AppError';

import { FakeCommentsEvaluationRepository } from '@models/repositories/fakes/FakeCommentsEvaluationRepository';
import { CreateCommentEvaluationService } from '../CreateCommentsEvaluationService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let fakeCommentsEvaluationsRepository: FakeCommentsEvaluationRepository;

let createCommentEvaluationService: CreateCommentEvaluationService;

describe('CreateCommentsEvaluationService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    fakeCommentsRepository = new FakeCommentsRepository();
    fakeCommentsEvaluationsRepository = new FakeCommentsEvaluationRepository();

    createCommentEvaluationService = new CreateCommentEvaluationService(
      fakeUsersRepository,
      fakeCommentsRepository,
      fakeCommentsEvaluationsRepository,
    );
  });

  it('should be able to create a comment evaluation', async () => {
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

    const commentEvaluation = await createCommentEvaluationService.execute({
      userId: user.id,
      commentId: comment.id,
      isLike: true,
    });

    expect(comment).toHaveProperty('id');
    expect(comment.userId).toBe(user.id);
    expect(comment.postId).toBe(post.id);
    expect(commentEvaluation).toHaveProperty('id');
  });

  it('should not be able to create a comment evaluation with a non-existing user', async () => {
    expect(
      createCommentEvaluationService.execute({
        userId: 'non-existing-user',
        commentId: 'comment-id',
        isLike: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a comment evaluation with a non-existing comment', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    expect(
      createCommentEvaluationService.execute({
        userId: user.id,
        commentId: 'non-existing-comment',
        isLike: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a comment evaluation in a comment that him already evaluate', async () => {
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

    await createCommentEvaluationService.execute({
      userId: user.id,
      commentId: comment.id,
      isLike: true,
    });

    expect(
      createCommentEvaluationService.execute({
        userId: user.id,
        commentId: comment.id,
        isLike: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
