import { FakePhotosRepository } from '@models/repositories/fakes/FakePhotosRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';

import { AppError } from '@shared/errors/AppError';
import { FakePostsEvaluationRepository } from '@models/repositories/fakes/FakePostsEvaluationsRepository';

import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';
import { CreatePostEvaluationService } from '../CreatePostEvaluationService';
import { ShowPostsEvaluationsService } from '../ShowPostsEvaluationsService';

let fakeUsersRepository: FakeUsersRepository;
let fakePhotosRepository: FakePhotosRepository;
let fakePostsRepository: FakePostsRepository;
let fakePostEvaluationRepository: FakePostsEvaluationRepository;

let createPostEvaluationService: CreatePostEvaluationService;
let showPostsEvaluationsService: ShowPostsEvaluationsService;

describe('ShowPostByUserIdService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    fakePostEvaluationRepository = new FakePostsEvaluationRepository();
    fakePhotosRepository = new FakePhotosRepository();

    createPostEvaluationService = new CreatePostEvaluationService(
      fakeUsersRepository,
      fakePostsRepository,
      fakePostEvaluationRepository,
    );

    showPostsEvaluationsService = new ShowPostsEvaluationsService(
      fakePostEvaluationRepository,
    );
  });

  it('should be able to show all posts evaluations', async () => {
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

    await fakePhotosRepository.create({
      userId: user.id,
      path: 'photo.jpg',
      size: 100,
    });

    await fakePhotosRepository.create({
      userId: user2.id,
      path: 'photo.jpg',
      size: 100,
    });

    const photos = await fakePhotosRepository.findByUserId(user.id);

    if (!photos) {
      throw new AppError('Photos not found');
    }

    const post = await fakePostsRepository.create({
      userId: user.id,
      photoId: photos[0].id,
      description: 'Description Test',
      filterUsed: 'none',
    });

    await createPostEvaluationService.execute({
      userId: user.id,
      postId: post.id,
      isLike: true,
    });

    await createPostEvaluationService.execute({
      userId: user2.id,
      postId: post.id,
      isLike: false,
    });

    const userPostsEvaluations = await showPostsEvaluationsService.execute();

    expect(userPostsEvaluations).toHaveLength(2);
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

    await fakePostsRepository.create({
      userId: user.id,
      photoId: 'photoId',
      description: 'Description Test',
      filterUsed: 'none',
    });

    const userPostsEvaluation = await showPostsEvaluationsService.execute();

    expect(userPostsEvaluation).toHaveLength(0);
  });
});
