import { AuthLoginResponse } from './auth-login-response';
import { AuthQuery } from './auth-query';
import { AuthLogin } from './auth-login';
import { Query } from '@powerConnect/shared';

export class AuthQueryHandler {
  constructor(private authLogin: AuthLogin) {}

  subscribedTo(): Query {
    return AuthQuery;
  }

  async handle(_query: AuthQuery): Promise<AuthLoginResponse> {
    const { email, password } = _query;
    return this.authLogin.run(email, password);
  }
}
