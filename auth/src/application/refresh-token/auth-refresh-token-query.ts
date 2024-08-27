import { Query } from '@powerconnect/shared';

export class AuthRefreshTokenQuery extends Query {
  public readonly authUserId: string;
  public readonly refreshToken: string;

  constructor(authUserId: string, refreshToken: string) {
    super();
    this.authUserId = authUserId;
    this.refreshToken = refreshToken;
  }
}
