import { AuthNotExist } from '../../domain/errors/auth-not-exist';
import { AuthRepository } from '../../domain/auth-repository';
import { AuthCurrentUserResponse } from './auth-current-user-response';

export class AuthCurrentUser {
  constructor(private repository: AuthRepository) {}

  async run(_id: string): Promise<AuthCurrentUserResponse> {
    const data = await this.repository.currentuser(_id);
    if (!data) {
      throw new AuthNotExist();
    }
    return new AuthCurrentUserResponse({
      user: { id: data.id.value, username: data.username!.value, email: data.email!.value }
    });
  }
}
