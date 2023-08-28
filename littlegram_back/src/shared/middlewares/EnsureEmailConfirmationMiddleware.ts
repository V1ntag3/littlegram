import { Request, Response, NextFunction } from 'express';

import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

@injectable()
export class EnsureEmailConfirmationMiddleware {
  constructor(
    @inject('UsersRepository')
    public userRepository: IUsersRepository,
  ) {}

  public execute = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const user = await this.userRepository.findById(req.user.id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.confirmed) {
      throw new AppError('Email not confirmed', 401);
    }

    return next();
  };
}
