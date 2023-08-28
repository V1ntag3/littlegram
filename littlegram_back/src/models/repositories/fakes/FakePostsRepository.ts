import { v4 } from 'uuid';

import { ICreatePostDTO } from '@models/dtos/ICreatePostDTO';
import { Post } from '@models/entities/Post';
import { IShowByUserPaginatedDTO } from '@models/dtos/IShowByUserPaginatedDTO';
import { IShowUserPaginatedDTO } from '@models/dtos/IShowUsersPaginatedDTO';
import { IPostsRepository } from '../interfaces/IPostsRepository';

class FakePostsRepository implements IPostsRepository {
  private posts: Post[] = [];

  public async findById(id: string): Promise<Post | null> {
    const findPost = this.posts.find(post => post.id === id);

    return findPost || null;
  }

  public async findByPhotoId(postId: string): Promise<Post | null> {
    const findPost = this.posts.find(post => post.id === postId);

    return findPost || null;
  }

  public async findByUserId(userId: string): Promise<Post[]> {
    const findPosts = this.posts.filter(post => post.userId === userId);

    return findPosts;
  }

  public async findByUserIdPaginated(
    data: IShowByUserPaginatedDTO,
  ): Promise<Post[]> {
    const findPosts = this.posts.filter(post => post.userId === data.userId);

    const skip = data.offset * data.limit;
    const take = data.limit;

    const posts = findPosts.slice(skip, skip + take);

    return posts;
  }

  public async create(postData: ICreatePostDTO): Promise<Post> {
    const post = new Post();

    Object.assign(post, { id: v4() }, postData);

    this.posts.push(post);

    return post;
  }

  public async save(post: Post): Promise<Post> {
    const findIndex = this.posts.findIndex(findPost => findPost.id === post.id);

    this.posts[findIndex] = post;

    return post;
  }

  public async all(): Promise<Post[]> {
    return this.posts;
  }

  public async allPaginated(data: IShowUserPaginatedDTO): Promise<Post[]> {
    const skip = data.offset * data.limit;
    const take = data.limit;

    const posts = this.posts.slice(skip, skip + take);

    return posts;
  }

  public async delete(postId: string): Promise<void> {
    this.posts = this.posts.filter(post => post.id !== postId);
  }
}

export { FakePostsRepository };
