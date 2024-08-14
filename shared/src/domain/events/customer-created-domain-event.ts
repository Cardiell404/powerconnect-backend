import { DomainEvent } from '../domain-event';

type CreateCustomerDomainEventBody = {
  readonly eventName: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerType: string;
  readonly customerIdentificationNumber: string;
  readonly email: string;
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
  readonly customerStatus: string;
  readonly lasUpdated: string;
  readonly createdAt: string;
  readonly createdBy: string;
};

export class CustomerCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'customer.created';

  readonly customerId: string;
  readonly customerName: string;
  readonly customerType: string;
  readonly customerIdentificationNumber: string;
  readonly email: string;
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
  readonly customerStatus: string;
  readonly lasUpdated: string;
  readonly createdAt: string;
  readonly createdBy: string;

  constructor({
    aggregateId,
    customerId,
    customerName,
    customerType,
    customerIdentificationNumber,
    email,
    dateOfBirth,
    billingInfo,
    locations,
    customerStatus,
    lasUpdated,
    createdAt,
    createdBy,
    eventId,
    occurredOn
  }: {
    aggregateId: string;
    customerId: string;
    customerName: string;
    customerType: string;
    customerIdentificationNumber: string;
    email: string;
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
    customerStatus: string;
    lasUpdated: string;
    createdAt: string;
    createdBy: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: CustomerCreatedDomainEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.customerId = customerId;
    this.customerType = customerType;
    this.customerName = customerName;
    this.billingInfo = billingInfo;
    this.customerIdentificationNumber = customerIdentificationNumber;
    this.createdAt = createdAt;
    this.customerStatus = customerStatus;
    this.dateOfBirth = dateOfBirth;
    this.createdBy = createdBy;
    this.lasUpdated = lasUpdated;
    this.locations = locations;
    this.email = email;
  }

  toPrimitives(): CreateCustomerDomainEventBody {
    return {
      eventName: CustomerCreatedDomainEvent.EVENT_NAME,
      customerId: this.customerId,
      customerName: this.customerName,
      customerType: this.customerType,
      email: this.email,
      dateOfBirth: this.dateOfBirth,
      customerIdentificationNumber: this.customerIdentificationNumber,
      billingInfo: this.billingInfo,
      locations: this.locations,
      customerStatus: this.customerStatus,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
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
      customerName: attributes.customerName,
      customerType: attributes.customerType,
      email: attributes.email,
      dateOfBirth: attributes.dateOfBirth,
      customerIdentificationNumber: attributes.customerIdentificationNumber,
      billingInfo: attributes.billingInfo,
      locations: attributes.locations,
      customerStatus: attributes.customerStatus,
      createdAt: attributes.createdAt,
      createdBy: attributes.createdBy,
      lasUpdated: attributes.lasUpdated,
      eventId,
      occurredOn
    });
  }
}
