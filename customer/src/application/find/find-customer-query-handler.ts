import { Query, QueryHandler } from '@powerconnect/shared';
import { CustomersResponse } from './customers-response';
import { CustomerFinder } from './customer-finder';
import { FindCustomerQuery } from './find-customer-query';

export class FindCustomerQueryHandler implements QueryHandler<CustomerFinder, CustomersResponse> {
  constructor(private finder: CustomerFinder) {}

  subscribedTo(): Query {
    return FindCustomerQuery;
  }

  handle(_query: FindCustomerQuery): Promise<CustomersResponse> {
    return this.finder.run();
  }
}
