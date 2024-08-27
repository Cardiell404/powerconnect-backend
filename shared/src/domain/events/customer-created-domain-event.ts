import { DomainEvent } from '../domain-event';

type CreateCustomerDomainEventBody = {
  readonly eventName: string;
  readonly customerId: string;
  readonly fullName: string;
  readonly customerType: string;
  readonly customerIdentificationNumber: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly dateOfBirth: string;
  readonly billingInfo: {
    billingAddress: { street: string; city: string; state: string; zipCode: string };
    paymentTerms: string;
    taxIdentification: string;
    paymentMethod: { methodType: string; referenceId: string };
  };
  readonly locations: {
    locationId: string;
    address: { street: string; city: string; state: string; zipCode: string };
    meterIds: string[];
  }[];
  readonly status: string;
  readonly lasUpdated: string;
  readonly createdAt: string;
};

export class CustomerCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'customer.created';

  readonly customerId: string;
  readonly fullName: string;
  readonly customerType: string;
  readonly customerIdentificationNumber: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly dateOfBirth: string;
  readonly billingInfo: {
    billingAddress: { street: string; city: string; state: string; zipCode: string };
    paymentTerms: string;
    taxIdentification: string;
    paymentMethod: { methodType: string; referenceId: string };
  };
  readonly locations: {
    locationId: string;
    address: { street: string; city: string; state: string; zipCode: string };
    meterIds: string[];
  }[];
  readonly status: string;
  readonly lasUpdated: string;
  readonly createdAt: string;

  constructor({
    aggregateId,
    customerId,
    fullName,
    customerType,
    customerIdentificationNumber,
    email,
    phoneNumber,
    dateOfBirth,
    billingInfo,
    locations,
    status,
    lasUpdated,
    createdAt,
    eventId,
    occurredOn
  }: {
    aggregateId: string;
    customerId: string;
    fullName: string;
    customerType: string;
    customerIdentificationNumber: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    billingInfo: {
      billingAddress: { street: string; city: string; state: string; zipCode: string };
      paymentTerms: string;
      taxIdentification: string;
      paymentMethod: { methodType: string; referenceId: string };
    };
    locations: {
      locationId: string;
      address: { street: string; city: string; state: string; zipCode: string };
      meterIds: string[];
    }[];
    status: string;
    lasUpdated: string;
    createdAt: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: CustomerCreatedDomainEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.customerId = customerId;
    this.customerType = customerType;
    this.fullName = fullName;
    this.billingInfo = billingInfo;
    this.customerIdentificationNumber = customerIdentificationNumber;
    this.createdAt = createdAt;
    this.status = status;
    this.dateOfBirth = dateOfBirth;
    this.lasUpdated = lasUpdated;
    this.locations = locations;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }

  toPrimitives(): CreateCustomerDomainEventBody {
    return {
      eventName: CustomerCreatedDomainEvent.EVENT_NAME,
      customerId: this.customerId,
      fullName: this.fullName,
      customerType: this.customerType,
      email: this.email,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      customerIdentificationNumber: this.customerIdentificationNumber,
      billingInfo: this.billingInfo,
      locations: this.locations,
      status: this.status,
      createdAt: this.createdAt,
      lasUpdated: this.lasUpdated
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: CreateCustomerDomainEventBody;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new CustomerCreatedDomainEvent({
      aggregateId,
      customerId: attributes.customerId,
      fullName: attributes.fullName,
      customerType: attributes.customerType,
      email: attributes.email,
      phoneNumber: attributes.phoneNumber,
      dateOfBirth: attributes.dateOfBirth,
      customerIdentificationNumber: attributes.customerIdentificationNumber,
      billingInfo: attributes.billingInfo,
      locations: attributes.locations,
      status: attributes.status,
      createdAt: attributes.createdAt,
      lasUpdated: attributes.lasUpdated,
      eventId,
      occurredOn
    });
  }
}
