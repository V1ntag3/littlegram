import { FakeHashProvider } from '@models/providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '@models/repositories/fakes/FakeUsersRepository';
import { FakeEmailProvider } from '@shared/container/providers/EmailProvider/fakes/FakeEmailProvider';

import { AuthenticateUserService } from '../AuthenticateUserService';

import { CreateUserService } from '../CreateUserService';
import { SendEmailVerificationService } from '../SendEmailVerificationService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeEmailProvider: FakeEmailProvider;

let createUser: CreateUserService;
let sendEmailVerification: SendEmailVerificationService;
let authenticateUser: AuthenticateUserService;

describe('SendEmailVerificationService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeEmailProvider = new FakeEmailProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    sendEmailVerification = new SendEmailVerificationService(fakeEmailProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user and send a email verification', async () => {
    const user = await createUser.execute({
      realName: 'test',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      isAdmin: false,
      confirmed: false,
    });

    const { token } = await authenticateUser.execute({
      email: 'test@example.com',
      password: '123456',
    });

    await sendEmailVerification.execute({
      user,
      token,
    });

    expect(fakeEmailProvider.emails).toHaveLength(1);
  });
});
