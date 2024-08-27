import { AuthUserId } from '@powerconnect/shared';
import { AuthRepository } from '../../domain/auth-repository';
import { AuthRefreshToken } from '../../domain/value-objects/auth-refresh-token';
import { AuthInvalidCredentials } from '../../domain/errors/auth-invalid-credentials';
import { Auth } from '../../domain/auth';

export class AuthLogout {
  constructor(private repository: AuthRepository) {
    this.repository = repository;
  }

  async run(authUserId: AuthUserId, refreshToken: AuthRefreshToken): Promise<void> {
    const existingAuth = await this.repository.getAuthById(authUserId);
    console.log(existingAuth);
    if (existingAuth && existingAuth.isRefreshTokenValid(refreshToken.value)) {
      const auth = Auth.invalidateRefreshToken(existingAuth);
      this.repository.signup(auth);
    } else {
      throw new AuthInvalidCredentials();
    }
  }
}
