import { AuthUserId, Query } from '@powerconnect/shared';
import { AuthRefreshTokenResponse } from './auth-refresh-token-response';
import { AuthRefreshTokenQuery } from './auth-refresh-token-query';
import { AuthRefreshToken } from './auth-refresh-token';
import { AuthRefreshToken as DAuthRefreshToken } from '../../domain/value-objects/auth-refresh-token';

export default class AuthRefreshTokenQueryHandler {
  constructor(private authRefreshToken: AuthRefreshToken) {}

  subscribedTo(): Query {
    return AuthRefreshTokenQuery;
  }

  async handle(query: AuthRefreshTokenQuery): Promise<AuthRefreshTokenResponse> {
    const refreshToken = new DAuthRefreshToken(query.refreshToken);
    const authUserId = new AuthUserId(query.authUserId);
    return this.authRefreshToken.run(authUserId, refreshToken);
  }
}
