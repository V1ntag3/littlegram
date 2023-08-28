import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommentEvaluation } from './CommentEvaluation';

import { Post } from './Post';
import { User } from './User';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, user => user.comments, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(
    () => CommentEvaluation,
    commentEvaluation => commentEvaluation.comment,
    { eager: true },
  )
  evaluations: CommentEvaluation[];

  likes: number | null;

  getLikes(): number | null {
    if (!this.evaluations) {
      return null;
    }

    return this.evaluations.filter(evaluation => evaluation.isLike).length;
  }

  dislikes: number | null;

  getDislikes(): number | null {
    if (!this.evaluations) {
      return null;
    }

    return this.evaluations.filter(evaluation => !evaluation.isLike).length;
  }

  userEvaluation: boolean | null;

  getUserEvaluation(userId: string): boolean | null {
    if (!this.evaluations) {
      return null;
    }

    const userEvaluation = this.evaluations.find(
      evaluation => evaluation.userId === userId,
    );

    if (!userEvaluation) {
      return null;
    }

    return userEvaluation.isLike;
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
