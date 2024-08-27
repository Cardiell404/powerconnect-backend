import { Nullable } from '@powerconnect/shared';
import { Customer } from '../../domain/customer';

export class CustomerResponse {
  readonly customer: Nullable<Customer>;

  constructor(customer: Customer) {
    this.customer = customer;
  }

  public toResponse() {
    return {
      id: this.customer?.customerId.value,
      firstName: this.customer?.firstName?.value,
      lastName: this.customer?.lastName?.value,
      dateOfBirth: this.customer?.dateOfBirth?.value,
      email: this.customer?.email?.value,
      phoneNumber: this.customer?.phoneNumber.value,
      status: this.customer?.status.value,
      identificationNumber: this.customer?.identificationNumber?.value,
      type: this.customer?.type.value,
      billingInfo: this.customer?.billingInfo.toPrimitives(),
      locations: this.customer?.locations.map(location => location.toPrimitives()),
      lastupdated: this.customer?.lastUpdated.value,
      createdAt: this.customer?.createdAt.value
    };
  }
}
