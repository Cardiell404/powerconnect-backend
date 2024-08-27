import { User } from '../../domain/user';

export class UsersResponse {
  readonly users: Array<User>;

  constructor(users: Array<User>) {
    this.users = users;
  }
}
