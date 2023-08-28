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
import { Post } from './Post';
import { User } from './User';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, user => user.photos)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Post, post => post.photo)
  posts: Post[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
