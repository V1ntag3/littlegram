import { ICreateUserDTO } from '@models/dtos/ICreateUserDTO';
import { User } from '@models/entities/User';

export interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsernameOrEmail(username: string, email: string): Promise<User | null>;

  findWithPagination(limit: number, offset: number): Promise<User[]>;
  count(): Promise<number>;

  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  all(): Promise<User[]>;
}
