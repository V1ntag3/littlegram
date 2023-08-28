import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from './Comment';
import { CommentEvaluation } from './CommentEvaluation';
import { Photo } from './Photo';
import { Post } from './Post';
import { PostEvaluation } from './PostEvaluation';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'real_name' })
  realName: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ name: 'avatar', type: 'varchar' })
  avatar: string | undefined;

  @Column()
  bio: string;

  @Column()
  confirmed: boolean;

  @Column({ name: 'is_admin' })
  isAdmin: boolean;

  @OneToMany(() => Photo, photo => photo.user)
  photos: Photo[];

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(
    () => CommentEvaluation,
    commentEvaluation => commentEvaluation.user,
  )
  commentsEvaluations: CommentEvaluation[];

  @OneToMany(() => PostEvaluation, postsEvaluation => postsEvaluation.user)
  postsEvaluations: PostEvaluation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
