import { container } from 'tsyringe';

import './providers';
import '@models/providers';

import { UsersRepository } from '@models/repositories/UsersRepository';
import { IUsersRepository } from '@models/repositories/interfaces/IUserRepository';

import { PhotosRepository } from '@models/repositories/PhotosRepository';
import { IPhotosRepository } from '@models/repositories/interfaces/IPhotosRepository';

import { PostRepository } from '@models/repositories/PostsRepository';
import { IPostsRepository } from '@models/repositories/interfaces/IPostsRepository';

import { CommentsRepository } from '@models/repositories/CommentsRepository';
import { ICommentsRepository } from '@models/repositories/interfaces/ICommentsRepository';

container.registerInstance<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerInstance<IPhotosRepository>(
  'PhotosRepository',
  PhotosRepository,
);

container.registerInstance<IPostsRepository>('PostsRepository', PostRepository);

container.registerInstance<ICommentsRepository>(
  'CommentsRepository',
  CommentsRepository,
);
