import { UserRepository } from '../../domain/user-repository';
import { UsersResponse } from './users-response';

export class UserFinder {
  constructor(private repository: UserRepository) {}

  async run(): Promise<UsersResponse> {
    const data = await this.repository.getUsers();
    return new UsersResponse(data);
  }
}
