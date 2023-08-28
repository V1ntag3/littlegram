import { connectionSource } from '@models/database/dataSource';
import { ICreateCommentDTO } from '@models/dtos/ICreateCommentDTO';

import { Comment } from '@models/entities/Comment';
import { ICommentsRepository } from './interfaces/ICommentsRepository';

const commentsRepository = connectionSource.getRepository(Comment);

export const CommentsRepository: ICommentsRepository =
  commentsRepository.extend({
    async findById(id: string): Promise<Comment | null> {
      const comment = await commentsRepository.findOne({
        where: {
          id,
        },
      });
      return comment;
    },

    async findByPostId(postId: string): Promise<Comment[] | null> {
      const comments = await commentsRepository.find({
        where: {
          postId,
        },
      });
      return comments;
    },

    async findByUserId(userId: string): Promise<Comment[] | null> {
      const comments = await commentsRepository.find({
        where: {
          userId,
        },
      });
      return comments;
    },

    async create(commentData: ICreateCommentDTO): Promise<Comment> {
      const comment = commentsRepository.create(commentData);

      await commentsRepository.save(comment);

      return comment;
    },

    async save(comment: Comment): Promise<Comment> {
      return commentsRepository.save(comment);
    },

    async all(): Promise<Comment[]> {
      return commentsRepository.find();
    },

    async delete(commentsId: string): Promise<void> {
      commentsRepository.delete(commentsId);
    },

    async deleteByPost(postId: string): Promise<void> {
      commentsRepository.delete({ postId });
    },

    findWithPagination(
      postId: string,
      limit = 10,
      offset = 0,
    ): Promise<Comment[]> {
      return this.find({
        where: { postId },
        take: limit,
        skip: offset,
      });
    },
    async countByPostId(postId: string): Promise<number> {
      return commentsRepository.count({ where: { postId } }); // Novo método
    },
  });
