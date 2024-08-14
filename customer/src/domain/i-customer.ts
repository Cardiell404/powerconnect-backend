export interface ICustomer {
  readonly customerId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly type: string;
  readonly identificationNumber: string;
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
  readonly phoneNumber: string;
  readonly status: string;
  readonly lastUpdated: string;
  readonly createdAt: string;
  readonly createdBy: string;
}
