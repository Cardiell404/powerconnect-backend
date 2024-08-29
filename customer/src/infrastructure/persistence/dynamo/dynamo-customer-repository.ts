import { Nullable, DynamoDBRepository, Filters, CustomerId } from '@powerconnect/shared';
import { Customer } from '../../../domain/customer';
import { CustomerRepository } from '../../../domain/customer-repository';
import { ICustomer } from '../../../domain/i-customer';

export class DynamoCustomerRepository extends DynamoDBRepository<Customer> implements CustomerRepository {
  protected tableName = 'Customer';

  public async getCustomers(): Promise<Array<Customer>> {
    const customers = await this.scan<ICustomer>();
    return customers.map(customer =>
      Customer.fromPrimitives({
        customerId: customer.customerId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        dateOfBirth: customer.dateOfBirth,
        identificationNumber: customer.identificationNumber,
        status: customer.status,
        billingInfo: customer.billingInfo,
        locations: customer.locations,
        lastUpdated: customer.lastUpdated,
        createdAt: customer.createdAt,
        phoneNumber: customer.phoneNumber,
        type: customer.type
      })
    );
  }

  public async getCustomerByFilters(filters: Filters): Promise<Nullable<Customer>> {
    const customer = await this.scanByFilters<ICustomer>(filters);
    return customer
      ? Customer.fromPrimitives({
          customerId: customer.customerId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          dateOfBirth: customer.dateOfBirth,
          identificationNumber: customer.identificationNumber,
          status: customer.status,
          billingInfo: customer.billingInfo,
          locations: customer.locations,
          lastUpdated: customer.lastUpdated,
          createdAt: customer.createdAt,
          phoneNumber: customer.phoneNumber,
          type: customer.type
        })
      : null;
  }

  public async getCustomerById(customerId: CustomerId): Promise<Nullable<Customer>> {
    const customer = await this.getItemById<ICustomer>({customerId: customerId.value});
    return customer
      ? Customer.fromPrimitives({
          customerId: customer.customerId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          dateOfBirth: customer.dateOfBirth,
          identificationNumber: customer.identificationNumber,
          status: customer.status,
          billingInfo: customer.billingInfo,
          locations: customer.locations,
          lastUpdated: customer.lastUpdated,
          createdAt: customer.createdAt,
          phoneNumber: customer.phoneNumber,
          type: customer.type
        })
      : null;
  }

  public async deleteCustomer(customer: Customer): Promise<void> {
    const customerId = customer.customerId.value;
    return await this.updateItemById({ customerId }, customer);
  }

  public async updateCustomer(customer: Customer): Promise<void> {
    return await this.persist(customer);
  }

  public async saveCustomer(customer: Customer): Promise<void> {
    await this.persist(customer);
  }
}
