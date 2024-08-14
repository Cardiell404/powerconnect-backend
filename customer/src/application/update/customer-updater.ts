import { CustomerRepository } from '../../domain/customer-repository';
import { CustomerNotExist } from '../../domain/errors/customer-not-exist';
import { Customer } from '../../domain/customer';
import { FiltersMapping } from '../../utils/FiltersMapping';
import { CustomerUpdateData } from '../../domain/types/customer-update-data';

export class CustomerUpdater {
  private repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
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
    billingInfo,
    locations,
    phoneNumber
  }: CustomerUpdateData): Promise<void> {
    const customer = await this.repository.getCustomerByFilters(FiltersMapping.customerId(customerId.value));

    if (!customer) {
      throw new CustomerNotExist();
    }

    const updateCustomer = Customer.update(customer, {
      customerId,
      firstName,
      lastName,
      email,
      dateOfBirth,
      identificationNumber,
      status,
      type,
      billingInfo,
      locations,
      phoneNumber
    });

    await this.repository.updateCustomer(updateCustomer);
  }
}
