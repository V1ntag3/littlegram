import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';
import { User } from '@models/entities/User';

@injectable()
export class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
  ) {}

  public async execute(limit = 10, offset = 0) {
    const users = await this.userRepository.findWithPagination(limit, offset);
    const totalUsers = await this.userRepository.count();
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users,
      totalUsers,
      totalPages,
      offset,
    };
  }
}
