import { CustomerId, EventBus } from '@powerconnect/shared';
import { CustomerRepository } from '../../domain/customer-repository';
import { Customer } from '../../domain/customer';
import { FiltersMapping } from '../../utils/FiltersMapping';
import { CustomerNotExist } from '../../domain/errors/customer-not-exist';

export class CustomerDeleter {
  private repository: CustomerRepository;

  constructor(
    repository: CustomerRepository,
    private bus: EventBus
  ) {
    this.repository = repository;
  }

  async run(customerId: CustomerId): Promise<void> {
    const existCustomer = await this.repository.getCustomerByFilters(FiltersMapping.customerId(customerId.value));

    if (!existCustomer) {
      throw new CustomerNotExist();
    }
    const customer = Customer.delete(existCustomer);
    await this.repository.deleteCustomer(customer);
    await this.bus.publish(customer.pullDomainEvents());
  }
}
