import { FakeUsersRepository } from '@models/repositories/fakes/FakeUsersRepository';
import { FakePostsRepository } from '@models/repositories/fakes/FakePostsRepository';
import { FakeCommentsRepository } from '@models/repositories/fakes/FakeCommentsRepository';

import { AppError } from '@shared/errors/AppError';

import { ShowCommentsService } from '../ShowCommentsService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let fakeCommentsRepository: FakeCommentsRepository;

let showCommentsService: ShowCommentsService;

describe('ShowCommentsService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    fakeCommentsRepository = new FakeCommentsRepository();

    showCommentsService = new ShowCommentsService(
      fakeCommentsRepository,
      fakePostsRepository,
    );
  });

  it('should be able to show ALL comments', async () => {
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

    await fakeCommentsRepository.create({
      text: 'This is a test comment',
      userId: user.id,
      postId: post.id,
    });

    await fakeCommentsRepository.create({
      text: 'This is a test comment',
      userId: user2.id,
      postId: post.id,
    });

    const userComments = await showCommentsService.execute({
      postId: post.id,
      limit: 10,
      offset: 0,
    });

    expect(userComments.comments).toHaveLength(2);
  });

  it('should NOT be able to show comments from a non-existing post', async () => {
    await expect(
      showCommentsService.execute({
        postId: 'non-existing-post',
        limit: 10,
        offset: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
