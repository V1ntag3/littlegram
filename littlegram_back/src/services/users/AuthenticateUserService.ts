import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { authConfig } from '@config/auth';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';
import { IHashProvider } from '@models/providers/HashProvider/models/IHashProvider';

import { User } from '@models/entities/User';
import { ICreateLoginSessionsDTO } from '@models/dtos/ICreateLoginSessionsDTO';

import { AppError } from '@shared/errors/AppError';

interface Response {
  user: User;

  token: string;
}

@injectable()
export class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: ICreateLoginSessionsDTO): Promise<Response> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Email or password incorrect', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}
