import { connectionSource } from '@models/database/dataSource';
import { ICreatePostDTO } from '@models/dtos/ICreatePostDTO';

import { Post } from '@models/entities/Post';
import { IPostsRepository } from './interfaces/IPostsRepository';

const postRepository = connectionSource.getRepository(Post);

export const PostRepository: IPostsRepository = postRepository.extend({
  async findById(id: string): Promise<Post | null> {
    const post = await postRepository.findOne({
      where: {
        id,
      },
    });
    return post;
  },

  async findByPhotoId(photoId: string): Promise<Post | null> {
    const post = await postRepository.findOne({
      where: {
        photoId,
      },
    });
    return post;
  },

  async findByUserId(userId: string): Promise<Post[]> {
    const post = await postRepository.find({
      where: {
        userId,
      },
    });
    return post;
  },

  async findByUserIdPaginated({ userId, limit, offset }): Promise<Post[]> {
    const post = await postRepository.find({
      where: {
        userId,
      },
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });
    return post;
  },

  async create(postData: ICreatePostDTO): Promise<Post> {
    const post = postRepository.create(postData);

    await postRepository.save(post);

    return post;
  },

  async save(post: Post): Promise<Post> {
    return postRepository.save(post);
  },

  async all(): Promise<Post[]> {
    const posts = await postRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return posts;
  },

  async allPaginated({ limit, offset }): Promise<Post[]> {
    const posts = await postRepository.find({
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    return posts;
  },

  async delete(photoId: string): Promise<void> {
    postRepository.delete(photoId);
  },
});
