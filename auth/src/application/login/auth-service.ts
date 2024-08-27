import { CryptoImplement, JwtImplement } from '@powerconnect/shared';
import { AuthLoginResponse } from './auth-login-response';
import { AuthRepository } from '../../domain/auth-repository';
import { AuthNotExist } from '../../domain/errors/auth-not-exist';
import { AuthInvalidCredentials } from '../../domain/errors/auth-invalid-credentials';
import { FiltersMapping } from '../../utils/FiltersMapping';
import { Auth } from '../../domain/auth';
import { AuthRefreshToken } from '../../domain/value-objects/auth-refresh-token';
import { AuthRefreshTokenExpiresAt } from '../../domain/value-objects/auth-refresh-token-expires-at';

export class AuthService {
  constructor(
    private repository: AuthRepository,
    private jwt: JwtImplement,
    private crypto: CryptoImplement
  ) {}

  async run(email: string, password: string): Promise<AuthLoginResponse> {
    const existingAuth = await this.repository.login(FiltersMapping.email(email));
    console.log(existingAuth);

    if (!existingAuth) {
      throw new AuthNotExist();
    }
    console.log('afds');
    const hashedPassword = this.crypto.hashMessage(password);
    if (!this.compareSync(hashedPassword, existingAuth.hashedPassword.toString())) {
      throw new AuthInvalidCredentials();
    }
    const accessToken = this.jwt.createToken({
      id: existingAuth.authUserId.value,
      email: existingAuth.email.value
    });
    const refreshToken = this.jwt.createRefreshToken({
      id: existingAuth.authUserId.value,
      email: existingAuth.email.value
    });
    const auth = Auth.updateRefreshToken(
      existingAuth,
      new AuthRefreshToken(refreshToken),
      new AuthRefreshTokenExpiresAt(this.jwt.getRefreshTokenExpiryDate())
    );
    this.repository.updateAuth(auth);
    return new AuthLoginResponse(accessToken, refreshToken);
  }

  private compareSync(data: string, hashedPassword: string): boolean {
    return data == hashedPassword;
  }
}
