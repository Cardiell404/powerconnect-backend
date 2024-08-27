import { Filters, Nullable, UserId } from '@powerconnect/shared';
import { User } from './user';

export interface UserRepository {
  saveUser(user: User): Promise<void>;

  getUsers(): Promise<Array<User>>;

  getUserByFilters(filter: Filters): Promise<Nullable<User>>;

  deleteUser(user: User): Promise<void>;

  updateUser(user: User): Promise<void>;

  getUserById(userId: UserId): Promise<Nullable<User>>

}
