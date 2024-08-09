import { JwtImplement } from '@powerconnect/shared';
import { AuthLoginResponse } from './auth-login-response';
import { AuthRepository } from '../../domain/auth-repository';
import { AuthNotExist } from '../../domain/errors/auth-not-exist';
import { AuthInvalidCredentials } from '../../domain/errors/auth-invalid-credentials';
import { FiltersMapping } from '../../utils/FiltersMapping';

export class AuthLogin {
  private repository: AuthRepository;
  private jwt: JwtImplement;

  constructor(repository: AuthRepository, jwt: JwtImplement) {
    this.repository = repository;
    this.jwt = jwt;
  }

  async run(email: string, password: string): Promise<AuthLoginResponse> {
    const data = await this.repository.login(FiltersMapping.email(email));
    if (!data) {
      throw new AuthNotExist();
    }
    if (!this.compareSync(password, data.password.toString())) {
      throw new AuthInvalidCredentials();
    }
    const token = this.jwt.createToken({ id: data.id.value, email: data.email.value });
    return new AuthLoginResponse({ user: { id: data.id.value }, token });
  }

  compareSync(data: string, encrypted: string): boolean {
    return data == encrypted;
  }
}
