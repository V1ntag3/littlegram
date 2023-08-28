import { FakeHashProvider } from '@models/providers/HashProvider/fakes/FakeHashProvider';
import { AppError } from '@shared/errors/AppError';
import { FakeUsersRepository } from '../../../models/repositories/fakes/FakeUsersRepository';

import { AuthenticateUserService } from '../AuthenticateUserService';

import { ConfirmEmailService } from '../ConfirmEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let confirmEmailService: ConfirmEmailService;

describe('ConfirmEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    confirmEmailService = new ConfirmEmailService(fakeUsersRepository);
  });

  it('should be able to confirm the email after create the account', async () => {
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

    await confirmEmailService.execute({
      email: response.user.email,
      token: response.token,
    });

    const newUser = await fakeUsersRepository.findById(user.id);

    expect(response).toHaveProperty('token');
    expect(response.user.email).toBe(user.email);
    expect(response.user.password).toBe(user.password);
    expect(newUser?.confirmed).toEqual(true);
  });

  it('should NOT be able to confirm the email of an account that not exists', async () => {
    await expect(
      confirmEmailService.execute({
        email: 'test@example.com',
        token: 'unvalid-token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to confirm the email after when the user id of token is different of the user id database', async () => {
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

    await fakeUsersRepository.create({
      realName: 'Test User 2',
      username: 'TestUser 2',
      email: 'testuser2@example.com',
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

    const response2 = await authenticateUser.execute({
      email: 'testuser2@example.com',
      password: '123456',
    });

    await expect(
      confirmEmailService.execute({
        email: response.user.email,
        token: response2.token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
