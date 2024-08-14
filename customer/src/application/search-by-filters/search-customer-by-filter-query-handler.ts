import { Query, QueryHandler } from '@powerconnect/shared';
import { SearchCustomerByFilterQuery } from './search-customer-by-filter-query';
import { CustomerResponse } from './customer-response';
import { CustomerByFilterSearcher } from './customer-by-filter-searcher';

export class SearchCustomerByFilterQueryHandler implements QueryHandler<SearchCustomerByFilterQuery, CustomerResponse> {
  constructor(private searcher: CustomerByFilterSearcher) {}

  subscribedTo(): Query {
    return SearchCustomerByFilterQuery;
  }

  handle(_query: SearchCustomerByFilterQuery): Promise<CustomerResponse> {
    return this.searcher.run(_query.filters);
  }
}
