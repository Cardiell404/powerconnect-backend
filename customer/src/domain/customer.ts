/* eslint-disable complexity */
import {
  Address,
  AggregateRoot,
  City,
  CreatedAt,
  CreatedBy,
  CustomerCreatedDomainEvent,
  DateOfBirth,
  Email,
  FirstName,
  LastName,
  LastUpdated,
  PhoneNumber,
  State,
  Street,
  Uuid,
  ZipCode
} from '@powerconnect/shared';
import { CustomerId } from './value-objects/customer-id';
import { CustomerIdentificationNumber } from './value-objects/customer-identification-number';
import { CustomerType } from './value-objects/customer-type';
import { CustomerStatus } from './value-objects/customer-status';
import { BillingInfo } from './value-objects/billing-info';
import { Location } from './value-objects/location';
import { CustomerCreateData } from './types/customer-create-data';
import { CustomerUpdateData } from './types/customer-update-data';
import { LocationId } from './value-objects/location-id';
import { PaymentTerms } from './value-objects/payment-terms';
import { PaymentMethod } from './value-objects/payment-method';
import { TaxIdentification } from './value-objects/tax-identification';
import { MethodType } from './value-objects/method-type';
import { ReferenceId } from './value-objects/reference-id';

export class Customer extends AggregateRoot {
  readonly customerId: CustomerId;
  readonly firstName: FirstName;
  readonly lastName: LastName;
  readonly email: Email;
  readonly phoneNumber: PhoneNumber;
  readonly dateOfBirth: DateOfBirth;
  readonly type: CustomerType;
  readonly billingInfo: BillingInfo;
  readonly locations: Array<Location>;
  readonly identificationNumber: CustomerIdentificationNumber;
  readonly status: CustomerStatus;
  readonly createdAt: CreatedAt;
  readonly lastUpdated: LastUpdated;
  readonly createdBy: CreatedBy;

  constructor({
    customerId,
    firstName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth,
    type,
    identificationNumber,
    status,
    billingInfo,
    locations,
    createdAt,
    createdBy,
    lastUpdated
  }: {
    customerId: CustomerId;
    identificationNumber: CustomerIdentificationNumber;
    status: CustomerStatus;
    firstName: FirstName;
    lastName: LastName;
    email: Email;
    phoneNumber: PhoneNumber;
    dateOfBirth: DateOfBirth;
    type: CustomerType;
    billingInfo: BillingInfo;
    locations: Array<Location>;
    createdAt: CreatedAt;
    createdBy: CreatedBy;
    lastUpdated: LastUpdated;
  }) {
    super();
    this.customerId = customerId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.identificationNumber = identificationNumber;
    this.status = status;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.type = type;
    this.billingInfo = billingInfo;
    this.locations = locations;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.lastUpdated = lastUpdated;
  }

  static create(customerCreateData: CustomerCreateData): Customer {
    const customer = new Customer({
      ...customerCreateData
    });

    customer.record(
      new CustomerCreatedDomainEvent({
        aggregateId: Uuid.random().value,
        customerId: customer.customerId.value,
        customerName: `${customer.firstName?.value} ${customer.lastName?.value}`,
        customerType: customer.type?.value,
        customerIdentificationNumber: customer.identificationNumber?.value,
        email: customer.email?.value,
        dateOfBirth: customer.dateOfBirth?.value,
        billingInfo: customer.billingInfo.toPrimitives(),
        locations: customer.locations.map(location => location.toPrimitives()),
        customerStatus: customer.status?.value,
        lasUpdated: customer.lastUpdated?.format(),
        createdAt: customer.createdAt?.format(),
        createdBy: customer.createdBy?.value
      })
    );

    return customer;
  }

  static update(existingCustomer: Customer, updates: Partial<CustomerUpdateData>): Customer {
    const updatedProps = {
      ...existingCustomer,
      ...updates,
      lastUpdated: LastUpdated.now()
    };
    return new Customer({ ...updatedProps });
  }

  static delete(existingCustomer: Customer): Customer {
    return new Customer({
      ...existingCustomer,
      status: new CustomerStatus('inactive'),
      lastUpdated: LastUpdated.now()
    });
  }

  static fromPrimitives(plainData: {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    type: string;
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
    identificationNumber: string;
    status: string;
    createdAt: string;
    lastUpdated: string;
    createdBy: string;
  }): Customer {
    return new Customer({
      customerId: new CustomerId(plainData.customerId),
      firstName: new FirstName(plainData.firstName),
      lastName: new LastName(plainData.lastName),
      email: new Email(plainData.email),
      dateOfBirth: new DateOfBirth(plainData.dateOfBirth),
      phoneNumber: new PhoneNumber(plainData.phoneNumber),
      type: new CustomerType(plainData.type),
      billingInfo: new BillingInfo(
        new Address(
          new Street(plainData.billingInfo.billingAddress.street),
          new City(plainData.billingInfo.billingAddress.city),
          new ZipCode(plainData.billingInfo.billingAddress.zipCode),
          new State(plainData.billingInfo.billingAddress.state)
        ),
        new PaymentTerms(plainData.billingInfo.paymentTerms),
        new TaxIdentification(plainData.billingInfo.taxIdentification),
        new PaymentMethod(
          new MethodType(plainData.billingInfo.paymentMethod.methodType),
          new ReferenceId(plainData.billingInfo.paymentMethod.referenceId)
        )
      ),
      locations: plainData.locations.map(location => {
        return new Location(
          new LocationId(location.locationId),
          new Address(
            new Street(location.address.street),
            new City(location.address.city),
            new ZipCode(location.address.zipCode),
            new State(location.address.state)
          ),
          location.meterIds
        );
      }),
      identificationNumber: new CustomerIdentificationNumber(plainData.identificationNumber),
      status: new CustomerStatus(plainData.status),
      createdAt: new CreatedAt(new Date(plainData.createdAt)),
      lastUpdated: new LastUpdated(new Date(plainData.lastUpdated)),
      createdBy: new CreatedBy(plainData.createdBy)
    });
  }

  toPrimitives() {
    return {
      customerId: this.customerId.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      phoneNumber: this.phoneNumber.value,
      dateOfBirth: this.dateOfBirth.value,
      type: this.type.value,
      billingInfo: this.billingInfo.toPrimitives(),
      locations: this.locations.map(location => location.toPrimitives()),
      identificationNumber: this.identificationNumber.value,
      status: this.status.value,
      createdAt: this.createdAt.format(),
      lastUpdated: this.lastUpdated.format(),
      createdBy: this.createdBy.value
    };
  }
}
