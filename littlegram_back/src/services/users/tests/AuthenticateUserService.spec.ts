import { FakeHashProvider } from '@models/providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';

import { AuthenticateUserService } from '../AuthenticateUserService';

import { AppError } from '../../../shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      realName: 'Test User',
      username: 'TestUser',
      email: 'testuser@example.com',
      password: '123456',
      avatar: 'test-avatar.jpg',
      isAdmin: false,
      bio: 'Test User Bio',
      confirmed: false,
    });

    const response = await authenticateUser.execute({
      email: 'testuser@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user.email).toBe(user.email);
    expect(response.user.password).toBe(user.password);
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'testuser@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      realName: 'Test User',
      username: 'TestUser',
      email: 'testuser@example.com',
      password: '123456',
      avatar: 'test-avatar.jpg',
      isAdmin: false,
      bio: 'Test User Bio',
      confirmed: false,
    });

    await expect(
      authenticateUser.execute({
        email: 'testuser@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
