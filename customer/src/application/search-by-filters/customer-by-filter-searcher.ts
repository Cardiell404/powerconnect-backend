import { Filters } from '@powerconnect/shared';
import { CustomerRepository } from '../../domain/customer-repository';
import { CustomerNotExist } from '../../domain/errors/customer-not-exist';
import { CustomerResponse } from './customer-response';

export class CustomerByFilterSearcher {
  constructor(private repository: CustomerRepository) {}

  async run(filters: Filters): Promise<CustomerResponse> {
    const result = await this.repository.getCustomerByFilters(filters);
    if (!result) {
      throw new CustomerNotExist();
    }
    return new CustomerResponse(result);
  }
}
