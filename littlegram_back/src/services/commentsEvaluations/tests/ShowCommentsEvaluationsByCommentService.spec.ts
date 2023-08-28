import { FakeUsersRepository } from '@models/repositories/fakes/FakeUsersRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';
import { FakeCommentsRepository } from '@models/repositories/fakes/FakeCommentsRepository';

import { AppError } from '@shared/errors/AppError';

import { FakeCommentsEvaluationRepository } from '@models/repositories/fakes/FakeCommentsEvaluationRepository';
import { ShowCommentsEvaluationsByCommentService } from '../ShowCommentsEvaluationsByCommentService';
import { CreateCommentEvaluationService } from '../CreateCommentsEvaluationService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let fakeCommentsEvaluationsRepository: FakeCommentsEvaluationRepository;

let createCommentEvaluationService: CreateCommentEvaluationService;
let showCommentsEvaluationsByCommentService: ShowCommentsEvaluationsByCommentService;

describe('ShowCommentsEvaluationByCommentService', () => {
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

    showCommentsEvaluationsByCommentService =
      new ShowCommentsEvaluationsByCommentService(
        fakeUsersRepository,
        fakeCommentsRepository,
        fakeCommentsEvaluationsRepository,
      );
  });

  it('should be able to show comments evaluations', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const user2 = await fakeUsersRepository.create({
      realName: 'test2',
      username: 'testUser2',
      email: 'test2@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const post = await fakePostsRepository.create({
      userId: user.id,
      photoId: 'photoId',
      description: 'Description Test',
      filterUsed: 'none',
    });

    const comment = await fakeCommentsRepository.create({
      text: 'This is a test comment',
      userId: user.id,
      postId: post.id,
    });

    await createCommentEvaluationService.execute({
      commentId: comment.id,
      userId: user.id,
      isLike: true,
    });

    await createCommentEvaluationService.execute({
      userId: user2.id,
      commentId: comment.id,
      isLike: false,
    });

    const userCommentsEvaluations =
      await showCommentsEvaluationsByCommentService.execute({
        userId: user.id,
        commentId: comment.id,
        limit: 10,
        offset: 0,
      });

    expect(userCommentsEvaluations.commentsEvaluations).toHaveLength(2);
  });

  it('should be able to show ALL comments evaluations', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const user2 = await fakeUsersRepository.create({
      realName: 'test2',
      username: 'testUser2',
      email: 'test2@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const post = await fakePostsRepository.create({
      userId: user.id,
      photoId: 'photoId',
      description: 'Description Test',
      filterUsed: 'none',
    });

    const comment = await fakeCommentsRepository.create({
      text: 'This is a test comment',
      userId: user.id,
      postId: post.id,
    });

    await createCommentEvaluationService.execute({
      commentId: comment.id,
      userId: user.id,
      isLike: true,
    });

    await createCommentEvaluationService.execute({
      userId: user2.id,
      commentId: comment.id,
      isLike: false,
    });

    const userCommentsEvaluations =
      await showCommentsEvaluationsByCommentService.execute({
        userId: user.id,
        commentId: comment.id,
        limit: 0,
        offset: 0,
      });

    expect(userCommentsEvaluations.commentsEvaluations).toHaveLength(2);
  });

  it('should be able to return 0 comments evaluations', async () => {
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
      photoId: 'photoId',
      description: 'Description Test',
      filterUsed: 'none',
    });

    const comment = await fakeCommentsRepository.create({
      text: 'This is a test comment',
      userId: user.id,
      postId: post.id,
    });

    const limit = 10;
    const offset = 0;

    const commentsEvaluations =
      await showCommentsEvaluationsByCommentService.execute({
        userId: user.id,
        commentId: comment.id,
        limit,
        offset,
      });

    expect(commentsEvaluations.commentsEvaluations).toHaveLength(0);
  });

  it('should be able to return 0 comments evaluations', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await fakeUsersRepository.create({
      realName: 'test2',
      username: 'testUser2',
      email: 'test2@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const post = await fakePostsRepository.create({
      userId: user.id,
      photoId: 'photoId',
      description: 'Description Test',
      filterUsed: 'none',
    });

    const comment = await fakeCommentsRepository.create({
      text: 'This is a test comment',
      userId: user.id,
      postId: post.id,
    });

    const userCommentsEvaluations =
      await showCommentsEvaluationsByCommentService.execute({
        userId: user.id,
        commentId: comment.id,
        limit: 0,
        offset: 0,
      });

    expect(userCommentsEvaluations.commentsEvaluations).toHaveLength(0);
  });

  it('should be able to return 0 comments from a offset too big', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await fakePostsRepository.create({
      userId: user.id,
      photoId: 'photoId',
      description: 'Description Test',
      filterUsed: 'none',
    });

    await fakePostsRepository.create({
      userId: user.id,
      photoId: 'photoId',
      description: 'Description Test',
      filterUsed: 'none',
    });

    const comment = await fakeCommentsRepository.create({
      text: 'This is a test comment',
      userId: user.id,
      postId: 'non-existing-post',
    });

    await createCommentEvaluationService.execute({
      commentId: comment.id,
      userId: user.id,
      isLike: true,
    });

    const comments = await showCommentsEvaluationsByCommentService.execute({
      userId: user.id,
      commentId: comment.id,
      limit: 10,
      offset: 2,
    });

    expect(comments.commentsEvaluations).toHaveLength(0);
  });

  it('should NOT be able to show a comment evaluation from a non existing comment', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'test',
      username: 'testUser',
      email: 'test@test.com',
      confirmed: true,
      isAdmin: false,
      password: '123456',
      avatar: 'avatar.jpg',
      bio: 'test bio',
    });

    await expect(
      showCommentsEvaluationsByCommentService.execute({
        userId: user.id,
        commentId: 'non-existing-comment',
        limit: 10,
        offset: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to show a comment evaluation from a non existing comment', async () => {
    await expect(
      showCommentsEvaluationsByCommentService.execute({
        userId: 'non-existing-user',
        commentId: 'non-existing-comment',
        limit: 10,
        offset: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
