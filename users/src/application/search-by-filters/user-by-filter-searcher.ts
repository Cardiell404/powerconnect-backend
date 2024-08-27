import { Filters } from '@powerconnect/shared';
import { UserRepository } from '../../domain/user-repository';
import { UserNotExist } from '../../domain/errors/user-not-exist';
import { UserResponse } from './user-response';

export class UserByFilterSearcher {
  constructor(private repository: UserRepository) {}

  async run(filters: Filters): Promise<UserResponse> {
    const result = await this.repository.getUserByFilters(filters);
    if (!result) {
      throw new UserNotExist();
    }
    return new UserResponse(result);
  }
}
