import { Filters, Nullable } from '@powerconnect/shared';
import { Customer } from './customer';
import { CustomerId } from './value-objects/customer-id';

export interface CustomerRepository {
  saveCustomer(customer: Customer): Promise<void>;

  getCustomers(): Promise<Array<Customer>>;

  getCustomerByFilters(filter: Filters): Promise<Nullable<Customer>>;

  getCustomerById(customerId: CustomerId): Promise<Nullable<Customer>>;

  deleteCustomer(customer: Customer): Promise<void>;

  updateCustomer(customer: Customer): Promise<void>;
}
