import { Filters, Query } from '@powerconnect/shared';

export class SearchCustomerByFilterQuery implements Query {
  readonly filters: Filters;

  constructor(filters: Filters) {
    this.filters = filters;
  }
}
