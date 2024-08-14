import { Customer } from '../../domain/customer';

export class CustomersResponse {
  readonly customers: Array<Customer>;

  constructor(customers: Array<Customer>) {
    this.customers = customers;
  }
}
