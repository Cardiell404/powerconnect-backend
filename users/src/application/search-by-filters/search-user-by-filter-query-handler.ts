import { Query, QueryHandler } from '@powerconnect/shared';
import { SearchUserByFilterQuery } from './search-user-by-filter-query';
import { UserResponse } from './user-response';
import { UserByFilterSearcher } from './user-by-filter-searcher';

export class SearchUserByFilterQueryHandler implements QueryHandler<SearchUserByFilterQuery, UserResponse> {
  constructor(private searcher: UserByFilterSearcher) {}

  subscribedTo(): Query {
    return SearchUserByFilterQuery;
  }

  handle(query: SearchUserByFilterQuery): Promise<UserResponse> {
    return this.searcher.run(query.filters);
  }
}
