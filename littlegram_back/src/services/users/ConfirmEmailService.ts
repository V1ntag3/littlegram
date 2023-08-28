import { verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { authConfig } from '@config/auth';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

import { AppError } from '@shared/errors/AppError';
import { TokenPayload } from '@shared/middlewares/ensureAuthenticate';

interface Request {
  email: string;

  token: string;
}

@injectable()
export class ConfirmEmailService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
  ) {}

  public async execute({ email, token }: Request): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email not found', 401);
    }

    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    if (sub !== user.id) {
      throw new AppError('Invalid token', 401);
    }

    await this.userRepository.update(user.id, { confirmed: true });
  }
}
