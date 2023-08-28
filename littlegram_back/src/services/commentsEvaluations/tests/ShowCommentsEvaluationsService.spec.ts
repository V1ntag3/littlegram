import { FakeUsersRepository } from '@models/repositories/fakes/FakeUsersRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';
import { FakeCommentsRepository } from '@models/repositories/fakes/FakeCommentsRepository';

import { FakeCommentsEvaluationRepository } from '@models/repositories/fakes/FakeCommentsEvaluationRepository';
import { CreateCommentEvaluationService } from '../CreateCommentsEvaluationService';
import { ShowCommentsEvaluationsService } from '../ShowCommentsEvaluationsService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let fakeCommentsEvaluationsRepository: FakeCommentsEvaluationRepository;

let createCommentEvaluationService: CreateCommentEvaluationService;
let showCommentsEvaluationsService: ShowCommentsEvaluationsService;

describe('ShowCommentsEvaluationService', () => {
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

    showCommentsEvaluationsService = new ShowCommentsEvaluationsService(
      fakeCommentsEvaluationsRepository,
    );
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
      await showCommentsEvaluationsService.execute();

    expect(userCommentsEvaluations).toHaveLength(2);
  });
});
