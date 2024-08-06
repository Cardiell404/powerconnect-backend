import { Query } from '@powerConnect/shared';
import { AuthCurrentUserResponse } from './auth-current-user-response';
import { AuthCurrentUser } from './auth-current-user';
import { AuthCurrentUserQuery } from './auth-current-user-query';

export default class AuthCurrentUserQueryHandler {
  constructor(private AuthCurrentUser: AuthCurrentUser) {}

  subscribedTo(): Query {
    return AuthCurrentUserQuery;
  }

  async handle(_query: AuthCurrentUserQuery): Promise<AuthCurrentUserResponse> {
    const { _id } = _query;
    return this.AuthCurrentUser.run(_id);
  }
}
