import { inject, injectable } from 'tsyringe';

import { IPhotosRepository } from '@models/repositories/interfaces/IPhotosRepository';
import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

import { AppError } from '@shared/errors/AppError';
import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';
import { Post } from '@models/entities/Post';

interface Request {
  userId: string;

  photoId: string;

  description: string;

  filterUsed: string;
}

@injectable()
export class CreatePostService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PhotosRepository')
    private photosRepository: IPhotosRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute({
    photoId,
    userId,
    description,
    filterUsed,
  }: Request): Promise<Post> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new AppError('Photo not found');
    }

    const photoIsFromUser = photo.userId === userId;

    if (!photoIsFromUser) {
      throw new AppError('Photo is not from this user');
    }

    if (description.length > 1000) {
      throw new AppError('Description must be less than 1000 characters');
    }

    const newPost = await this.postsRepository.create({
      userId,
      photoId,
      description,
      filterUsed,
    });

    return newPost;
  }
}
