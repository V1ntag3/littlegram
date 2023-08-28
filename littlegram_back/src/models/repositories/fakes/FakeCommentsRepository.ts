import { v4 } from 'uuid';

import { Comment } from '@models/entities/Comment';
import { ICreateCommentDTO } from '@models/dtos/ICreateCommentDTO';
import { ICommentsRepository } from '../interfaces/ICommentsRepository';

class FakeCommentsRepository implements ICommentsRepository {
  private comments: Comment[] = [];

  public async findById(id: string): Promise<Comment | null> {
    const findPost = this.comments.find(comment => comment.id === id);

    return findPost || null;
  }

  public async findByPostId(postId: string): Promise<Comment[] | null> {
    const findPosts = this.comments.filter(
      comment => comment.postId === postId,
    );

    return findPosts || null;
  }

  public async findByUserId(userId: string): Promise<Comment[] | null> {
    const findPosts = this.comments.filter(
      comment => comment.userId === userId,
    );

    return findPosts || null;
  }

  public async findWithPagination(
    postId: string,
    limit: number,
    offset: number,
  ): Promise<Comment[]> {
    const comments = this.comments.filter(comment => comment.postId === postId);

    return comments.slice(offset, offset + limit);
  }

  public async countByPostId(postId: string): Promise<number> {
    const comments = this.comments.filter(comment => comment.postId === postId);

    return comments.length;
  }

  public async create(commentData: ICreateCommentDTO): Promise<Comment> {
    const comment = new Comment();

    Object.assign(comment, { id: v4() }, commentData);

    this.comments.push(comment);

    return comment;
  }

  public async save(comment: Comment): Promise<Comment> {
    const findIndex = this.comments.findIndex(
      findPost => findPost.id === comment.id,
    );

    this.comments[findIndex] = comment;

    return comment;
  }

  public async all(): Promise<Comment[]> {
    return this.comments;
  }

  public async delete(commentId: string): Promise<void> {
    this.comments = this.comments.filter(comment => comment.id !== commentId);
  }

  public async deleteByPost(postId: string): Promise<void> {
    this.comments = this.comments.filter(comment => comment.postId !== postId);
  }
}

export { FakeCommentsRepository };
