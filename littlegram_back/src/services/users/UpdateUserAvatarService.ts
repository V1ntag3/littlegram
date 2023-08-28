import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';
import { User } from '@models/entities/User';

import { IStorageProvider } from '@shared/container/providers/DiskStorageProvider/models/IStorageProvider';

import { AppError } from '@shared/errors/AppError';

interface Request {
  userId: string;
  avatarFilename: string;
}

@injectable()
export class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('DiskStorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ userId, avatarFilename }: Request): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      await this.storageProvider.deleteTmpFile(avatarFilename);
      throw new AppError('Only authenticated users can change avatar.');
    }

    if (user.avatar) {
      await this.storageProvider.deleteAvatarFile(user.avatar);
    }

    const filename = await this.storageProvider.saveAvatarFile(avatarFilename);
    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}
