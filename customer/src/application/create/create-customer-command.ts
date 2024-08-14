import { Command } from '@powerconnect/shared';

type Params = {
  customerId: string;
  firstName: string;
  lastName: string;
  type: string;
  identificationNumber: string;
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
  phoneNumber: string;
  status: string;
  createdBy: string;
};

export class CreateCustomerCommand extends Command {
  public readonly customerId: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly type: string;
  public readonly identificationNumber: string;
  public readonly email: string;
  public readonly dateOfBirth: string;
  public readonly billingInfo: {
    billingAddress: { street: string; city: string; state: string; zipCode: string };
    paymentTerms: string;
    taxIdentification: string;
    paymentMethod: { methodType: string; referenceId: string };
  };
  public readonly locations: {
    locationId: string;
    address: { street: string; city: string; state: string; zipCode: string };
    meterIds: string[];
  }[];
  public readonly phoneNumber: string;
  public readonly status: string;
  public readonly createdBy: string;

  constructor({
    customerId,
    firstName,
    lastName,
    type,
    identificationNumber,
    email,
    dateOfBirth,
    billingInfo,
    locations,
    phoneNumber,
    status,
    createdBy
  }: Params) {
    super();
    this.customerId = customerId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.dateOfBirth = dateOfBirth;
    this.identificationNumber = identificationNumber;
    this.type = type;
    this.billingInfo = billingInfo;
    this.locations = locations;
    this.phoneNumber = phoneNumber;
    this.status = status;
    this.createdBy = createdBy;
  }
}
