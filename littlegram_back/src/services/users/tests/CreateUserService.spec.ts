import { FakeHashProvider } from '@models/providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '@models/repositories/fakes/FakeUsersRepository';

import { AppError } from '@shared/errors/AppError';

import { CreateUserService } from '../CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    expect(user).toHaveProperty('id');
    expect(user.realName).toBe('test');
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    await expect(
      createUser.execute({
        realName: 'test',
        username: 'testUser',
        email: 'test@example.com',
        password: '123456',
        isAdmin: false,
        confirmed: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
