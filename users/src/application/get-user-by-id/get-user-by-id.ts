import { UserId } from '@powerconnect/shared';
import { UserRepository } from '../../domain/user-repository';
import { UserNotExist } from '../../domain/errors/user-not-exist';
import { UserResponse } from './user-response';

export class GetUserById {
  constructor(private repository: UserRepository) {}

  async run(userId: UserId): Promise<UserResponse> {
    const result = await this.repository.getUserById(userId);
    if (!result) {
      throw new UserNotExist();
    }
    return new UserResponse(result);
  }
}
