import { CustomerRepository } from '../../domain/customer-repository';
import { EventBus } from '@powerconnect/shared';
import { CustomerAlreadyExists } from '../../domain/errors/customer-already-exists';
import { Customer } from '../../domain/customer';
import { FiltersMapping } from '../../utils/FiltersMapping';
import { CustomerCreateData } from '../../domain/types/customer-create-data';

export class CustomerCreator {
  private repository: CustomerRepository;

  constructor(
    repository: CustomerRepository,
    private bus: EventBus
  ) {
    this.repository = repository;
  }

  async run({
    customerId,
    firstName,
    lastName,
    email,
    dateOfBirth,
    identificationNumber,
    status,
    type,
    createdBy,
    billingInfo,
    locations,
    phoneNumber,
    createdAt,
    lastUpdated
  }: CustomerCreateData): Promise<void> {
    const existCustomer = await this.repository.getCustomerByFilters(
      FiltersMapping.customerIdentificationNumberAndHidden(identificationNumber.value)
    );

    if (existCustomer) {
      throw new CustomerAlreadyExists(existCustomer.customerId.value);
    }
    const customer = Customer.create({
      customerId,
      firstName,
      lastName,
      email,
      dateOfBirth,
      status,
      type,
      createdBy,
      billingInfo,
      locations,
      phoneNumber,
      identificationNumber,
      createdAt,
      lastUpdated
    });
    await this.repository.saveCustomer(customer);
    await this.bus.publish(customer.pullDomainEvents());
  }
}
