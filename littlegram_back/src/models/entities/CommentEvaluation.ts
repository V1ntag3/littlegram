import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';

@Entity('comments_evaluations')
export class CommentEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, user => user.commentsEvaluations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'comment_id' })
  commentId: string;

  @ManyToOne(() => Comment, comment => comment.evaluations)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @Column({ name: 'is_like' })
  isLike: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
