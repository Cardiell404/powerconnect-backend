import { Query, QueryHandler } from '@powerconnect/shared';
import { UsersResponse } from './users-response';
import { UserFinder } from './user-finder';
import { FindUserQuery } from './find-user-query';

export class FindUserQueryHandler implements QueryHandler<FindUserQuery, UsersResponse> {
  constructor(private finder: UserFinder) {}

  subscribedTo(): Query {
    return FindUserQuery;
  }

  async handle(_query: FindUserQuery): Promise<UsersResponse> {
    return await this.finder.run();
  }
}
