import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';
import { ShowUserService } from '../ShowUserService';

let fakeUsersRepository: FakeUsersRepository;
let showUser: ShowUserService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUser = new ShowUserService(fakeUsersRepository);
  });

  it('should be able to show the user', async () => {
    const user1 = await fakeUsersRepository.create({
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

    const usersList = [user1, user2];

    const usersPaginated = await showUser.execute();

    expect(usersPaginated.users).toEqual(usersList);
  });
});
