import { AuthUserId, JwtImplement } from '@powerconnect/shared';
import { AuthRefreshToken as DAuthRefreshToken } from '../../domain/value-objects/auth-refresh-token';
import { AuthRepository } from '../../domain/auth-repository';
import { AuthRefreshTokenResponse } from './auth-refresh-token-response';
import { Auth } from '../../domain/auth';
import { AuthRefreshTokenExpiresAt } from '../../domain/value-objects/auth-refresh-token-expires-at';
import { AuthInvalidCredentials } from '../../domain/errors/auth-invalid-credentials';

export class AuthRefreshToken {
  constructor(
    private repository: AuthRepository,
    private jwt: JwtImplement
  ) {}

  async run(authUserId: AuthUserId, refreshToken: DAuthRefreshToken): Promise<AuthRefreshTokenResponse> {
    const existingAuth = await this.repository.getAuthById(authUserId);

    if (!existingAuth || !existingAuth.isRefreshTokenValid(refreshToken.value)) {
      throw new AuthInvalidCredentials();
    }
    const newAccessToken = this.jwt.createToken({
      id: existingAuth.authUserId.value,
      email: existingAuth.email.value
    });
    let newRefreshToken: string | undefined;

    if (this.jwt.shouldRotateRefreshToken(refreshToken.value)) {
      const newRefreshToken = this.jwt.createRefreshToken({
        id: existingAuth.authUserId.value,
        email: existingAuth.email.value
      });

      const auth = Auth.updateRefreshToken(
        existingAuth,
        new DAuthRefreshToken(newRefreshToken),
        new AuthRefreshTokenExpiresAt(this.jwt.getRefreshTokenExpiryDate())
      );

      this.repository.updateAuth(auth);
    }
    return new AuthRefreshTokenResponse(newAccessToken, newRefreshToken);
  }
}
