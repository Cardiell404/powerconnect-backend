import { CustomerRepository } from '../../domain/customer-repository';
import { CustomersResponse } from './customers-response';

export class CustomerFinder {
  constructor(private repository: CustomerRepository) {}

  async run(): Promise<CustomersResponse> {
    const data = await this.repository.getCustomers();
    return new CustomersResponse(data);
  }
}
