import { inject, injectable } from 'tsyringe';

import { User } from '@models/entities/User';
import { ICreateUserDTO } from '@models/dtos/ICreateUserDTO';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';
import { IHashProvider } from '@models/providers/HashProvider/models/IHashProvider';

import { AppError } from '@shared/errors/AppError';

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(data: ICreateUserDTO): Promise<User> {
    const userAlreadyExists = await this.userRepository.findByUsernameOrEmail(
      data.username,
      data.email,
    );

    if (userAlreadyExists) {
      throw new AppError('Username or email already exists');
    }

    const hashedPassword = await this.hashProvider.generateHash(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return user;
  }
}
