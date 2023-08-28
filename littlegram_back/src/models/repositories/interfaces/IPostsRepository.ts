import { ICreatePostDTO } from '@models/dtos/ICreatePostDTO';
import { IShowByUserPaginatedDTO } from '@models/dtos/IShowByUserPaginatedDTO';
import { IShowUserPaginatedDTO } from '@models/dtos/IShowUsersPaginatedDTO';

import { Post } from '@models/entities/Post';

export interface IPostsRepository {
  findById(id: string): Promise<Post | null>;
  findByPhotoId(photoId: string): Promise<Post | null>;
  findByUserId(userId: string): Promise<Post[]>;
  findByUserIdPaginated(data: IShowByUserPaginatedDTO): Promise<Post[]>;

  all(): Promise<Post[]>;
  allPaginated(data: IShowUserPaginatedDTO): Promise<Post[]>;

  create(data: ICreatePostDTO): Promise<Post>;
  save(post: Post): Promise<Post>;
  delete(postId: string): Promise<void>;
}
