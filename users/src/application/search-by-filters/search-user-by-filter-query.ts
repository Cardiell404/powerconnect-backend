import { Filters, Query } from '@powerconnect/shared';

export class SearchUserByFilterQuery extends Query {
  readonly filters: Filters;

  constructor(filters: Filters) {
    super();
    this.filters = filters;
  }
}
