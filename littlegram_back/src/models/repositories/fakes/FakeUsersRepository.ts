import { v4 } from 'uuid';

import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { User } from '../../entities/User';

import { IUsersRepository } from '../interfaces/IUserRepository';

export class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async all(): Promise<User[]> {
    return this.users;
  }

  public async findById(id: string): Promise<User | null> {
    const findUser = this.users.find(user => user.id === id);

    return findUser || null;
  }

  public async findByUsername(username: string): Promise<User | null> {
    const findUser = this.users.find(user => user.username === username);

    return findUser || null;
  }

  public async findWithPagination(
    limit: number,
    offset: number,
  ): Promise<User[]> {
    const users = this.users.slice(offset, offset + limit);

    return users;
  }

  public async count(): Promise<number> {
    return this.users.length;
  }

  public async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    const findUser = this.users.find(
      user => user.username === username || user.email === email,
    );

    return findUser || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const findUser = this.users.find(user => user.email === email);

    return findUser || null;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: v4() }, userData);

    this.users.push(user);

    return user;
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    const findIndex = this.users.findIndex(user => user.id === id);

    this.users[findIndex] = { ...this.users[findIndex], ...data };

    return this.users[findIndex];
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}
